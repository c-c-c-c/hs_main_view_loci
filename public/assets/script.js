'use strict';

var vm = new Vue({
	el: '#mycounter',
	data: {
		count: 0
	},
	methods: {
		countUp: function countUp() {
			this.count++;
			changeRotateSpeed();
		}
	}
});

var vm_stop = new Vue({
	el: '#mystop',
	methods: {
		hsStop: function hsStop() {
			Speed_0();
		}
	}
});

var howManySpinners = 50;
var scene = new THREE.Scene();
var box = void 0;
var controls = void 0;
var renderer = void 0;
var camera = void 0;
var model = [];
//let model = {};
var model2 = {};
var model3 = {};
var rotate_speed = 0.05;
var r_radian = 0;
var c_radian = 0;
var geometry = void 0;
var material = void 0;

function renderHandSpinner() {
	'use strict';

	var light = void 0;
	var ambient = void 0;
	var gridHelper = void 0;
	var axisHelper = void 0;
	var lightHelp = void 0;
	var width = 1000;
	var height = 1000;
	var modelPath = void 0;
	var scale_hs = void 0;

	//light
	light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 200, 80);
	scene.add(light);
	ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);

	//camera
	camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000);
	camera.position.set(0, 400, 300);
	camera.lookAt(scene.position);

	// helper 現在は非表示
	//gridHelper = new THREE.GridHelper(200, 50);
	//scene.add(gridHelper);
	// axisHelper = new THREE.AxisHelper(1000);
	// scene.add(axisHelper);
	//lightHelper = new THREE.DirectionalLightHelper(light , 20)
	//scene.add(lightHelper);

	//controls
	controls = new THREE.OrbitControls(camera);
	//cameraの自動回転
	controls.autoRotate = true;
	controls.autoRotateSpeed = 1.5;

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.getElementById('stage').appendChild(renderer.domElement);

	//modelPath = 'src/bear.json';
	//modelPath = 'src/handspiner_3d.json';
	//modelPath = '../src/data/handspiner_3d_geo.json';
	var modelPath1 = './src/data/handspiner_3d_geo.json';
	var modelPath2 = './src/data/hs3.json';
	//modelPath = './src/data/hs4.json';
	//modelPath = './src/data/hs5.json';
	var modelPath3 = './src/data/hs6.json';

	//let phongMat = new THREE.MeshPhongMaterial(mat);
	//let phongMat2 = new THREE.MeshPhongMaterial(mat);
	//let phongMat3 = new THREE.MeshPhongMaterial(mat);
	//for (let mt of faceMat.materials) {
	//  mt.color = new THREE.Color(0xffcc88);
	//}


	var loader = new THREE.JSONLoader();

	//for (let j=0; j < 3; j++) {

	// if (j % 3 == 0 ) {
	// 		modelPath = modelPath1;
	// 		scale_hs = 100;
	// } else if ( j % 3 == 1) {
	// 		modelPath = modelPath2;
	// 		scale_hs = 100;
	// } else {
	// 		modelPath = modelPath3;
	// 		scale_hs = 0.7;
	// }

	modelPath = modelPath3;

	loader.load(modelPath, function (geo, mat) {
		geometry = geo;
		material = mat;

		for (var i = 0; i < howManySpinners; i++) {
			var phongMat = new THREE.MeshPhongMaterial(mat);
			model[i] = new THREE.Mesh(geo, phongMat);

			var randX = 300 * Math.random() - 150;
			var randY = 400 * Math.random() - 250;
			var randZ = 600 * Math.random() - 300;

			if (i == 0) {
				model[i].position.set(0, 20, 0);
			} else {
				model[i].position.set(randX, randY, randZ);
			}

			//let randColor = Math.random() * 0xffffff ;
			//let randColor = Math.random() * 61184  + 256;
			//let randColor =  Math.floor(Math.random() * 61184) + 256;
			//let randColor =  41100 + 256;
			var randColor = 256 * Math.floor(Math.random() * 156) + 255 + 25600;
			if (i % 2 == 0) {
				randColor = 256 * Math.floor(Math.random() * 156) + 200 + 25600;
			}

			if (i % 4 == 0) {
				randColor = 0x666666;
			} else if (i % 4 == 1) {
				randColor = 0xcccccc;
			} else if (i % 4 == 2) {
				randColor = 0xaaaaaa;
			} else {
				randColor = 0x888888;
			}

			//model[i].scale.set(scale, scale, scale);
			model[i].scale.set(10, 10, 10);
			model[i].material.color = new THREE.Color(randColor);
			model[i].material.opacity = 0.5 * Math.random() + 0.3;
			model[i].material.transparent = true;
			scene.add(model[i]);
		}
		render();
	});
	//}

}

function addSpinner() {
	var phongMat = new THREE.MeshPhongMaterial(material);
	model = new THREE.Mesh(geometry, phongMat);
	var randX = 800 * Math.random();
	var randY = 800 * Math.random();
	var randZ = 800 * Math.random();

	var size = Math.random();
	model.scale.set(size, size, size);
	model.position.set(randX, randY, randZ);
	var randColor = Math.random() * 0xffffff;
	model.material.color = new THREE.Color(randColor);
	scene.add(model);
}

function render() {
	console.log("coming");

	requestAnimationFrame(render);
	r_radian += 0.01;

	for (var i = 0; i < howManySpinners; i++) {
		model[i].rotation.y += rotate_speed;
		model[i].position.y += (Math.sin(r_radian) - Math.sin(r_radian - 0.01)) * 150;
	}

	c_radian += 0.007;
	var cameraZ = 150 * Math.sin(c_radian) + 150;
	// let cameraZ = 0;
	camera.position.set(0, 600, cameraZ);

	controls.update();
	renderer.render(scene, camera);
}

function changeRotateSpeed() {
	//controls.autoRotateSpeed = vm.count*10;
	rotate_speed += vm.count * 0.01;
	for (var i = 0; i < howManySpinners; i++) {

		model[i].rotation.y = 1.8 * vm.count;
	}
}

function Speed_0() {
	vm.count = 0;
	rotate_speed = 0;
	//addSpinner();
}

renderHandSpinner();
//# sourceMappingURL=script.js.map