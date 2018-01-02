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

var howManySpinners = 30;
var scene = new THREE.Scene();
var box = void 0;
var controls = void 0;
var renderer = void 0;
var camera = void 0;
var scene_bg = void 0;
var camera_bg = void 0;

var model = [];
//let model = {};
var model2 = {};
var model3 = {};
var rotate_speed = 0.05;
var r_radian = 0;
var c_radian = 0;
var geometry = void 0;
var material = void 0;
var WIDTH = 1400;
var HEIGHT = 500;

function renderHandSpinner() {
	'use strict';

	var light = void 0;
	var ambient = void 0;
	var gridHelper = void 0;
	var axisHelper = void 0;
	var lightHelp = void 0;
	var modelPath = void 0;
	var scale_hs = void 0;

	//light
	light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 200, 80);
	scene.add(light);
	ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);

	//camera
	camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 1, 1600);
	camera.position.set(0, 200, 120);
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
	renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0xffffff);
	renderer.autoClearColor = false;
	renderer.setPixelRatio(window.devicePixelRatio);
	document.getElementById('stage').appendChild(renderer.domElement);

	//modelPath = 'src/bear.json';
	//modelPath = 'src/handspiner_3d.json';
	//modelPath = '../src/data/handspiner_3d_geo.json';
	var modelPath1 = '../src/data/handspiner_3d_geo.json';
	var modelPath2 = '../src/data/hs3.json';
	//modelPath = './src/data/hs4.json';
	//modelPath = './src/data/hs5.json';
	var modelPath3 = '../src/data/hs300k.json';

	//let phongMat = new THREE.MeshPhongMaterial(mat);
	//let phongMat2 = new THREE.MeshPhongMaterial(mat);
	//let phongMat3 = new THREE.MeshPhongMaterial(mat);
	//for (let mt of faceMat.materials) {
	//  mt.color = new THREE.Color(0xffcc88);
	//}


	var loader = new THREE.JSONLoader();

	var _loop = function _loop(j) {

		setTimeout(function () {
			//modelPath = modelPath2;
			//scale_hs = 30;
			if (j % 3 == 0) {
				modelPath = modelPath1;
				scale_hs = 0.0002;
				console.log("hoge1");
			} else if (j % 3 == 1) {
				modelPath = modelPath2;
				scale_hs = 30;
				console.log("hoge2");
			} else {
				modelPath = modelPath3;
				scale_hs = 5;
				console.log("hoge3");
			}

			loader.load(modelPath, function (geo, mat) {
				geometry = geo;
				material = mat;

				if (j % 3 == 0) {
					scale_hs = 0.4;
				} else if (j % 3 == 1) {
					scale_hs = 40;
				} else {
					scale_hs = 20;
				}

				for (var i = 0; i < howManySpinners; i++) {
					var hsMat = void 0;
					if (i % 4 == 0) {

						hsMat = new THREE.MeshPhongMaterial(mat);
					} else {
						hsMat = new THREE.MeshBasicMaterial(mat);
						hsMat.wireframe = true;
					}

					var hsIndex = i + j * howManySpinners;
					console.log(hsIndex);
					model[hsIndex] = new THREE.Mesh(geo, hsMat);

					var randX = 1800 * Math.random() - 900;
					var randY = 1000 * Math.random() - 600;
					var randZ = 200 * Math.random() - 100;

					model[hsIndex].position.set(randX, randY, randZ);

					// let randColor =  256 * Math.floor(Math.random() * 156) + 255 + 25600;
					// if (i % 2 == 0 ) {
					// 	randColor =  256 * Math.floor(Math.random() * 156) + 200 + 25600;
					// }
					var randColor = void 0;
					if (i % 4 == 0) {
						randColor = 0x707070;
					} else if (i % 4 == 1) {
						randColor = 0xcccccc;
					} else if (i % 4 == 2) {
						randColor = 0xaaaaaa;
					} else {
						randColor = 0x888888;
					}

					//model[i].scale.set(scale, scale, scale);
					model[hsIndex].scale.set(scale_hs, scale_hs, scale_hs);
					model[hsIndex].material.color = new THREE.Color(randColor);
					model[hsIndex].material.opacity = Math.random();
					model[hsIndex].material.transparent = true;
					model[hsIndex].rotate = i % 7 == 0 ? 0.6 + Math.random() * 0.2 : Math.random() * 0.1 + 0.03;
					scene.add(model[hsIndex]);
				}
			});
		}, 2000);
	};

	for (var j = 0; j < 3; j++) {
		_loop(j);
	}

	///残像処理
	//背景の定義
	scene_bg = new THREE.Scene();
	camera_bg = new THREE.OrthographicCamera(0, WIDTH, HEIGHT, 0, 0, 1000);
	var bg_geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10);
	var bg_material = new THREE.MeshBasicMaterial({
		color: 0xFFFFFF,
		transparent: true,
		opacity: 0.25
	});

	var bg = new THREE.Mesh(bg_geometry, bg_material);
	bg.position.x = WIDTH / 2;
	bg.position.y = HEIGHT / 2;
	scene_bg.add(bg);

	render();
}

// function addSpinner () {
//   let phongMat = new THREE.MeshPhongMaterial(material);
//   model = new THREE.Mesh(geometry, phongMat);
// 	let randX = 800 * Math.random();
// 	let randY = 800 * Math.random();
// 	let randZ = 800 * Math.random();
//
//   let size = Math.random();
// 	model.scale.set(size, size, size);　　　
//   model.position.set(randX, randY, randZ);
// 	let randColor = Math.random() * 0xffffff;　　　
// 	model.material.color = new THREE.Color(randColor);
// 	scene.add(model);　
// }

function render() {

	requestAnimationFrame(render);
	r_radian += 0.01;
	console.log(model.length);

	for (var i = 0; i < model.length - 1; i++) {
		model[i].rotation.y += model[i].rotate;
		model[i].position.y += (Math.sin(r_radian) - Math.sin(r_radian - 0.01)) * 150;
	}

	c_radian += 0.007;
	var cameraZ = 150 * Math.sin(c_radian) + 150;
	// let cameraZ = 0;
	camera.position.set(0, 600, cameraZ);

	controls.update();
	renderer.render(scene, camera);
	renderer.render(scene_bg, camera_bg);
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