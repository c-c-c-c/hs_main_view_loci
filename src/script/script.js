var vm = new Vue({
  el: '#mycounter',
  data: {
    count: 0
  },
  methods: {
    countUp: function() {
            this.count++;
            changeRotateSpeed ();
      }
  }
});

var vm_stop = new Vue({
  el: '#mystop',
  methods: {
    hsStop: function() {
            Speed_0();
    }
  }
});

let howManySpinners = 50;
let scene = new THREE.Scene();
let box;
let controls;
let renderer;
let camera;
let model = [];
//let model = {};
let model2 = {};
let model3 = {};
let rotate_speed = 0.05;
let r_radian = 0;
let c_radian = 0;
let geometry;
let material;

function renderHandSpinner () {
  'use strict';
  let light;
  let ambient;
  let gridHelper;
	let axisHelper;
  let lightHelp;
  let width = 1000;
  let height = 1000;
	let modelPath ;
	let scale_hs;

   //light
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 200, 80);
  scene.add(light);
  ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

	//camera
  camera = new THREE.PerspectiveCamera(30, width /　height, 1 , 1000);
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
  let modelPath1 = './src/data/handspiner_3d_geo.json';
  let modelPath2 = './src/data/hs3.json';
  //modelPath = './src/data/hs4.json';
  //modelPath = './src/data/hs5.json';
  let modelPath3 = './src/data/hs6.json';

	　　　
	    //let phongMat = new THREE.MeshPhongMaterial(mat);
	    //let phongMat2 = new THREE.MeshPhongMaterial(mat);
	    //let phongMat3 = new THREE.MeshPhongMaterial(mat);
	    //for (let mt of faceMat.materials) {
	    //  mt.color = new THREE.Color(0xffcc88);
	  	//}




	let loader = new THREE.JSONLoader();　　

		 for (let j = 0; j < 3; j++) {




			 setTimeout(()=> {
			//modelPath = modelPath2;
			//scale_hs = 30;
				if (j % 3 == 0 ) {
					 modelPath = modelPath1;
					 scale_hs = 0.0002;
					 console.log("hoge1");

				} else if ( j % 3 == 1) {
					 modelPath = modelPath2;
					 scale_hs = 30;
					 console.log("hoge2");
				} else {
					 modelPath = modelPath3;
					 scale_hs = 5;
					 console.log("hoge3");
				}


				loader.load(modelPath, (geo, mat) => {
					geometry = geo;
					material = mat;

					if (j % 3 == 0 ) {
						 scale_hs = 0.2;

					} else if ( j % 3 == 1) {
						 scale_hs = 20;

					} else {
						 scale_hs = 10;
					}



					for (let i=0; i < howManySpinners; i++ ) {
				    let phongMat = new THREE.MeshPhongMaterial(mat);
				    model[i] = new THREE.Mesh(geo, phongMat);

						let randX = 300 * Math.random() - 150;
						let randY = 400 * Math.random() - 250;
						let randZ = 600 * Math.random() - 300;

				    if (i == 0) {
							model[i].position.set(0, 20, 0);
						} else {
							model[i].position.set(randX, randY, randZ);
						}　　

				    let randColor =  256 * Math.floor(Math.random() * 156) + 255 + 25600;
				    if (i % 2 == 0 ) {
							randColor =  256 * Math.floor(Math.random() * 156) + 200 + 25600;
						}

						if (i % 4 == 0 ) {
							randColor =  0x666666;
						} else if(i%4==1) {
							randColor = 0xcccccc;
						} else if(i % 4==2) {
							randColor = 0xaaaaaa;
						} else {
							randColor = 0x888888;
						}

						//model[i].scale.set(scale, scale, scale);
						model[i].scale.set(scale_hs, scale_hs, scale_hs);
						model[i].material.color = new THREE.Color(randColor);
						model[i].material.opacity = Math.random();
						model[i].material.transparent = true;
						scene.add(model[i]);　　　
					}

				});
				}, 2000);

			}
			render ();
	}


function addSpinner () {
  let phongMat = new THREE.MeshPhongMaterial(material);
  model = new THREE.Mesh(geometry, phongMat);
	let randX = 800 * Math.random();
	let randY = 800 * Math.random();
	let randZ = 800 * Math.random();

  let size = Math.random();
	model.scale.set(size, size, size);　　　
  model.position.set(randX, randY, randZ);
	let randColor = Math.random() * 0xffffff;　　　
	model.material.color = new THREE.Color(randColor);
	scene.add(model);　
}

function render () {

  requestAnimationFrame(render);
  r_radian += 0.01;

	for (let i=0; i < howManySpinners  ; i++ ) {
  	//model[i].rotation.y += rotate_speed;
    //model[i].position.y += (Math.sin(r_radian) - Math.sin(r_radian-0.01))*150 ;

	}

	c_radian += 0.007;
  let cameraZ = 150 * (Math.sin(c_radian)) +150;
 // let cameraZ = 0;
	camera.position.set(0, 600, cameraZ);

  controls.update();
  renderer.render(scene, camera);
}

function changeRotateSpeed () {
  //controls.autoRotateSpeed = vm.count*10;
 	rotate_speed += vm.count*0.01;
  for (let i=0 ; i < howManySpinners; i++) {

		model[i].rotation.y = 1.8*vm.count;
  }
}

function Speed_0 () {
  vm.count = 0;
  rotate_speed = 0;
 	//addSpinner();
}

renderHandSpinner();
