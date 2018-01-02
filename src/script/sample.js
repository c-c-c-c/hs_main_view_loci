////////////////////////////////////////////////////////////////////
// 物理系パラメータ
////////////////////////////////////////////////////////////////////

//実験室内の時間間隔
PHYSLAB.dt = 0.001; //1E-15*0.01;

//描画スキップ回数
PHYSLAB.skip = 100;
//実験室内の重力加速度
PHYSLAB.g = new THREE.Vector3( 0, 0, -10);
//ばね定数
PHYSLAB.k = 0;
//静止摩擦係数
PHYSLAB.mu = 1.0;
//動摩擦係数
PHYSLAB.mu_star = 1.0;
//判定
PHYSLAB.delta = 0.01;
//空気抵抗係数（粘性抵抗）
PHYSLAB.gamma = 0.00;
//転がり抵抗係数
PHYSLAB.Crr = 0.00;
//反発係数
PHYSLAB.Er = 1.0;
//角運動量-並進運動量交換率
PHYSLAB.Et = 1.0;
//真空の誘電率
PHYSLAB.epsilon0 = 8.85418782E-12;
//電気素量
PHYSLAB.e = 1.60217657E-19;
//陽子質量
PHYSLAB.protonMass = 1.67262158E-27;
//電子質量
PHYSLAB.electronMass = 9.1093897E-31;
//電子ボルト
PHYSLAB.eV = 0.1602E-18; //[J]
//重力定数
PHYSLAB.G = 6.67408E-11; //[Nm^2/kg^2]
//レナード・ジョーンズポテンシャルで発生する力の強さ
PHYSLAB.RJ_epsilon = 1.0;
//レナード・ジョーンズポテンシャルの最下点距離
PHYSLAB.RJ_sigma = 1.0;

//結合の種類
PHYSLAB.SphereCollision = 1001;        //剛体球同士の衝突
PHYSLAB.SolidConnection = 1002;        //剛体棒による結合
PHYSLAB.LinearSpringConnection = 1003; //線形ばねによる結合
PHYSLAB.CoulombInteraction = 1004;     //クーロン相互作用
PHYSLAB.UniversalGravitation = 1005;   //万有引力相互作用
PHYSLAB.LennardJonesPotential = 1006;  //レナード・ジョーンズポテンシャル

//実験室内のスケール
PHYSLAB.DistanceScale = 1.0; //1E-9; //ナノメートル
PHYSLAB.TimeScale =     1.0; //1E-15; //アト秒
PHYSLAB.EnergyScale =   1.0; //PHYSLAB.eV; //電子ボルト

PHYSLAB.init = function(){

	var atoms = [];
	atoms[ 0 ] = {
		mass : 2.0,
		radius : 0.5,
		color : 0xFFFFFF,
		position : new THREE.Vector3(0,0,12), //位置ベクトル
		velocity : new THREE.Vector3(0,0,0), //速度ベクトル
		dynamic : false
	}
	atoms[ 1 ] = {
		mass :  1.0,
		radius : 1.0,
		color : 0xFFFFFF,
		position : new THREE.Vector3(10,0,12), //位置ベクトル
		velocity : new THREE.Vector3(0,-2,0), //速度ベクトル
		dynamic : true
	}

	var connects = [];
	connects[ 0 ] = {
		type : PHYSLAB.SolidConnection, //結合タイプ
		pair1 : 0,
		pair2 : 1,
		color : 0xFFFFFF,
	}

	molecule = new Molecule({
		record : {
			enable : true,
			max : 100000
		},
		atoms : atoms,
		connects : connects
	});
}

////////////////////////////////////////////////////////////////////
// windowイベントの定義
////////////////////////////////////////////////////////////////////

var molecule;
window.addEventListener("load", function () {
	PHYSLAB.init();
	threeStart(); //Three.jsのスタート関数の実行
});
////////////////////////////////////////////////////////////////////
// Three.jsスタート関数の定義
////////////////////////////////////////////////////////////////////
function threeStart() {
	initThree();  //Three.js初期化関数の実行
	initEvent();  //イベントの準備
	initLight();  //光源初期化関数の実行
	initObject(); //オブジェクト初期化関数の実行
	initCamera(); //カメラ初期化関数の実行
	loop();       //無限ループ関数の実行
}
////////////////////////////////////////////////////////////////////
// Three.js初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var renderer,    //レンダラーオブジェクト
    scene,       //シーンオブジェクト
    canvasFrame; //キャンバスフレームのDOM要素
function initThree() {
	//キャンバスフレームDOM要素の取得
	canvasFrame = document.getElementById('canvas-frame');
	//レンダラーオブジェクトの生成
	renderer = new THREE.WebGLRenderer({ antialias: true });

	if (!renderer) alert('Three.js の初期化に失敗しました');
	//レンダラーのサイズの設定
	renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);
	//キャンバスフレームDOM要素にcanvas要素を追加
	canvasFrame.appendChild(renderer.domElement);

	//レンダラークリアーカラーの設定
	renderer.setClearColor(0x000000, 1.0);

	//シーンオブジェクトの生成
	scene = new THREE.Scene();
}
////////////////////////////////////////////////////////////////////
// イベント準備関数
////////////////////////////////////////////////////////////////////
var stopFrag = true;
var visibleFlag = true;
function initEvent() {
	//スタートボタン
	var startButton = document.getElementById("startButton");
	//一時停止ボタン
	startButton.addEventListener("click", function () {
		stopFrag = !stopFrag;
		if( stopFrag ) startButton.innerHTML = "計算再開";
		else startButton.innerHTML = "一時停止";
	});
	//スタートボタン
	var visibleButton = document.getElementById("visibleButton");
	//一時停止ボタン
	visibleButton.addEventListener("click", function () {
		visibleFlag = !visibleFlag;
		if( visibleFlag ) visibleButton.innerHTML = "振り子を非表示";
		else visibleButton.innerHTML = "振り子を再表示";
	});


}
////////////////////////////////////////////////////////////////////
// カメラ初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var camera;    //カメラオブジェクト
function initCamera() {
	//カメラオブジェクトの生成
	camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000);
	//カメラの位置の設定
	camera.position.set(0, 30, 8);
	//カメラの上ベクトルの設定
	camera.up.set(0, 0, 1);
	//カメラの中心位置ベクトルの設定
	camera.lookAt({ x: 0, y: 0, z: 0 }); //トラック剛体球利用時は自動的に無効

	//トラック剛体球オブジェクトの宣言
	trackball = new THREE.TrackballControls(camera, canvasFrame);

	//トラック剛体球動作範囲のサイズとオフセットの設定
	trackball.screen.width = canvasFrame.clientWidth;                        //横幅
	trackball.screen.height = canvasFrame.clientHeight;                      //縦幅
	trackball.screen.offsetLeft = canvasFrame.getBoundingClientRect().left;  //左オフセット
	trackball.screen.offsetTop = canvasFrame.getBoundingClientRect().top;    //右オフセット

	//トラック剛体球の回転無効化と回転速度の設定
	trackball.noRotate = false;
	trackball.rotateSpeed = 4.0;

	//トラック剛体球の拡大無効化と拡大速度の設定
	trackball.noZoom = false;
	trackball.zoomSpeed = 4.0;

	//トラック剛体球のカメラ中心移動の無効化と中心速度の設定
	trackball.noPan = false;
	trackball.panSpeed = 1.0;
	trackball.target = new THREE.Vector3(0, 0, 6);

	//トラック剛体球のスタティックムーブの有効化
	trackball.staticMoving = true;
	//トラック剛体球のダイナミックムーブ時の減衰定数
	trackball.dynamicDampingFactor = 0.3;
}
////////////////////////////////////////////////////////////////////
// 光源初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var directionalLight,  //平行光源オブジェクト
    ambientLight;      //環境光オブジェクト
function initLight() {
	//平行光源オブジェクトの生成
	directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
	//平行光源オブジェクトの位置の設定
	directionalLight.position.set(50, 50, 10);

	//環境光オブジェクトの生成
	ambientLight = new THREE.AmbientLight(0x333333);
	//環境光オブジェクトのシーンへの追加
	scene.add(ambientLight);

	//平行光源オブジェクトのシーンへの追加
	scene.add(directionalLight);
}
////////////////////////////////////////////////////////////////////
// オブジェクト初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var axis; //軸オブジェクト
var atoms = [];
function initObject() {
	/*
	//軸オブジェクトの生成
	axis = new THREE.AxisHelper(10);
	//軸オブジェクトのシーンへの追加
	scene.add(axis);
	//軸オブジェクトの位置座標を設定
	axis.position.set(0, 0, 0.01);
*/
	//斜面のパラメータ
	var slope = {
		x : 0,
		y : 0.0,
		z : 1,
		d : 0
	}
/*
	//坂道オブジェクト
	slope.CG = new THREE.Group();
	//坂道オブジェクトのシーンへの追加
	scene.add( slope.CG );

	//平面オブジェクトの生成
	slope.plane = new THREE.Mesh(
		new THREE.PlaneGeometry(40, 40),
		new THREE.MeshNormalMaterial()
	);
	//平面オブジェクトの位置座標を設定
	slope.plane.position.set(0, 0, 0);
	//平面オブジェクトのシーンへの追加
	slope.CG.add( slope.plane );

	//グリッドオブジェクトの生成
	slope.grid = new THREE.GridHelper(20, 40);
	//グリッドオブジェクトのオイラー角を設定
	slope.grid.rotation.set( Math.PI/2 , 0, 0);
	slope.CG.add( slope.grid );
*/

	//img要素の生成
	var img = new Image();
	img.src = UV_Grid_Sm;  //DataURL

	var texture = new THREE.Texture( img );
	texture.needsUpdate = true;

	molecule.CG = new THREE.Group();
	scene.add( molecule.CG );

	for( var i = 0; i < molecule.atoms.length; i++ ){

		if( i==0 ){
			//形状オブジェクトの宣言と生成
			var geometry = new THREE.BoxGeometry( molecule.atoms[ i ].radius, molecule.atoms[ i ].radius, molecule.atoms[ i ].radius);
			var material = new THREE.MeshPhongMaterial({ color: molecule.atoms[ i ].color });

		} else {
			//形状オブジェクトの宣言と生成
			var geometry = new THREE.SphereGeometry( molecule.atoms[ i ].radius / PHYSLAB.DistanceScale, 20,20);
			geometry.rotateX( Math.PI / 2 ) ;
			//材質オブジェクトの宣言と生成
			var material = new THREE.MeshPhongMaterial({ color: molecule.atoms[ i ].color, map:texture });

		}

		molecule.atoms[ i ].CG = new THREE.Mesh(geometry, material);
		molecule.CG.add( molecule.atoms[ i ].CG );

		if( molecule.atoms[ i ].arrows.force.available ){
			//力可視化用矢印オブジェクト
			molecule.atoms[ i ].arrows.force.CG = new THREE.ArrowHelper(
				new THREE.Vector3( 0, 0, 1 ).normalize(), //方向ベクトル
				new THREE.Vector3( 0, 0, 0 ),             //原点
				5,                                        //長さ
				molecule.atoms[ i ].arrows.force.color,   //色
				1,
				1
			);
			molecule.CG.add( molecule.atoms[ i ].arrows.force.CG );
		}

		if( molecule.atoms[ i ].dynamic ){

			////////////////////////////////////////
			//軌跡描画用線オブジェクトの準備//////////////
			//点の数
			var n = molecule.record.max;
			//形状オブジェクトの宣言
			var geometry = new THREE.BufferGeometry();
			//アトリビュート変数の宣言
			var indexes = new Uint16Array( n ); //インデックス配列
			var positions = new Float32Array( n * 3 ); //頂点座標
			var colors = new Float32Array( n * 3 );    //頂点色
			//配列の初期化
			for (var j = 0; j < indexes.length; j++ ) {

				indexes[ j ] = j;

				var k = j * 3;
				//頂点の位置座標の設定
				positions[ k ] = 0;     //x値
				positions[ k + 1 ] = 0; //y値
				positions[ k + 2 ] = 0; //z値
				//頂点色の設定
				colors[ k ] = 1;        //r値
				colors[ k + 1 ] = 1;    //g値
				colors[ k + 2 ] = 1;    //b値
			}
			//アトリビュート変数の設定
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			//頂点インデックス配列を設定
			geometry.setIndex( new THREE.BufferAttribute( indexes, 1 ) );

			//材質オブジェクトの宣言と生成
			var material = new THREE.LineBasicMaterial({ vertexColors: true });

			molecule.atoms[ i ].trajectory = {};
			//線オブジェクトの生成
			molecule.atoms[ i ].trajectory.CG = new THREE.Line( geometry, material );

			//線オブジェクトのシーンへの追加
			molecule.CG.add( molecule.atoms[ i ].trajectory.CG );

			molecule.atoms[ i ].trajectory.count = 0;

		}

	}

	for( var i = 0; i< molecule.connects.length; i++ ){

		//結合タイプが剛体棒結合ではない場合はスキップ
		if( molecule.connects[ i ].type == PHYSLAB.LinearSpringConnection ) {

			//形状オブジェクトの宣言と生成
			var geometry = new SpringGeometry(
				molecule.connects[ i ].radius,  //ばねの半径
				molecule.connects[ i ].tube,   //管の半径
				1.0,  //ばねの長さ
				molecule.connects[ i ].windingNumber,  //ばねの巻き数
				10,  //外周の分割数
				10  //管周の分割数
			);
			var material = new THREE.MeshPhongMaterial( {color: molecule.connects[ i ].color });
			//ばねオブジェクトの生成
			molecule.connects[ i ].CG = new THREE.Mesh(geometry, material);
			//ばねオブジェクトのシーンへの追加
			molecule.CG.add(molecule.connects[ i ].CG);

			//メソッドの追加
			molecule.connects[ i ].CG.setSpringBottomToTop = function ( bottom, top ){

				//ばねオブジェクトの底面中心から上面中心へ向かうベクトル
				var L = new THREE.Vector3( ).subVectors( top, bottom );
				//ばねの中心座標
				var R = new THREE.Vector3( ).addVectors( top, bottom ).multiplyScalar( 1/2 );
				//ばねオブジェクトの位置を指定
				this.position.copy( R );
				//ばねの形状オブジェクトの更新
				this.geometry.updateSpringGeometry (
					this.radius,         //外円の半径
					this.tube,           //管円の半径
					L.length()          //バネの長さ
				);
				//ばねの向きを指定
				this.lookAt( top );
			}
		}


		//結合タイプが剛体棒結合ではない場合はスキップ
		if( molecule.connects[ i ].type == PHYSLAB.SolidConnection ) {

			var ni = molecule.connects[ i ].pair1;
			var nj = molecule.connects[ i ].pair2;

			var rij = new THREE.Vector3().subVectors(
				molecule.atoms[ ni ].position,
				molecule.atoms[ nj ].position
			);
			var rij_g = new THREE.Vector3().addVectors(
				molecule.atoms[ ni ].position,
				molecule.atoms[ nj ].position
			).multiplyScalar( 0.5 );

			//形状オブジェクトの宣言と生成
			var geometry = new THREE.CylinderGeometry( 0.05, 0.05, rij.length(), 10, 10 );
			geometry.rotateX( Math.PI/2 );
			var material = new THREE.MeshPhongMaterial( {color: molecule.connects[ i ].color });

			//剛体棒オブジェクトの生成
			molecule.connects[ i ].CG = new THREE.Mesh(geometry, material);
			molecule.CG.add( molecule.connects[ i ].CG );

			molecule.connects[ i ].CG.position.copy( rij_g );
			molecule.connects[ i ].CG.lookAt( molecule.atoms[ ni ].position );

		}

	}



}

////////////////////////////////////////////////////////////////////
// 無限ループ関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var step = 0; //ステップ数
function loop() {
	//トラック剛体球によるカメラオブジェクトのプロパティの更新
	trackball.update();

//console.log(molecule.atoms[ 1 ].position.z, molecule.atoms[ 1 ].velocity.z);

	if( !stopFrag ){
		//時刻の取得
		var time = step * PHYSLAB.dt;
		for (var k = 0; k < PHYSLAB.skip; k++) {
			step++;
			molecule.timeEvolution( PHYSLAB.dt );

		}

	}
	if( step == 0 ){

		var energy = molecule.calculateEnergy();
		total0 = energy.kinetic + energy.rotation  + energy.potential;

	}


	if( !stopFrag || step == 0 ){

		var energy = molecule.calculateEnergy();
		document.getElementById("kinetic").innerHTML = (energy.kinetic / PHYSLAB.EnergyScale ).toFixed(15);
		document.getElementById("rotation").innerHTML = (energy.rotation / PHYSLAB.EnergyScale ).toFixed(15);
		document.getElementById("potential").innerHTML = (energy.potential / PHYSLAB.EnergyScale ).toFixed(15);
		var total = energy.kinetic + energy.rotation + energy.potential;
		document.getElementById("energy").innerHTML = (total).toFixed(15);

		document.getElementById("error").innerHTML = ( 100　* Math.abs(total - total0)/ total0 ).toFixed(15);

		time = molecule.step * PHYSLAB.dt;
		document.getElementById("time").innerHTML = (time / PHYSLAB.TimeScale ).toFixed(5);

		var momentum1 = new THREE.Vector3();
		var momentum2 = new THREE.Vector3();
		var m2 = 0;
		for( var i = 0; i < molecule.atoms.length; i++ ){

			momentum1.add( molecule.atoms[ i ].velocity.clone().multiplyScalar( molecule.atoms[ i ].mass ) );
			if( i == 0 )  momentum2.add( molecule.atoms[ i ].omega.clone().multiplyScalar( molecule.atoms[ i ].moment ) );
			else  momentum2.sub( molecule.atoms[ i ].omega.clone().multiplyScalar( molecule.atoms[ i ].moment ) );

		}
//		console.log( "1", momentum1 );
//		console.log( "2", momentum2 );

	}

	for( var i = 0; i < molecule.atoms.length; i++ ){

		molecule.atoms[ i ].CG.position.copy( molecule.atoms[ i ].position ).divideScalar( PHYSLAB.DistanceScale );
		molecule.atoms[ i ].CG.visible = visibleFlag;

		//ローカル座標系における角速度ベクトル
		var omega = molecule.atoms[i].omega.clone();
		//回転行列の生成
		var m4 = new THREE.Matrix4().makeRotationFromEuler( molecule.atoms[i].CG.rotation );
		var m4_i = new THREE.Matrix4().getInverse( m4 );
		//グローバル座標系の角速度ベクトルの計算
		omega.applyMatrix4(m4_i);

		//球の回転
		var q = new THREE.Quaternion().setFromAxisAngle( omega.clone().normalize(), omega.length() * PHYSLAB.dt * PHYSLAB.skip);
		molecule.atoms[i].CG.quaternion.multiply( q );

		if( molecule.atoms[ i ].arrows.force.available ){
			//力可視化用矢印オブジェクト
			var obj = molecule.atoms[ i ].arrows.force;
			var F = molecule.atoms[ i ].force.length();
			var L = F * obj.scale;
			if( L < obj.minLength ) L = obj.minLength;
			if( L > obj.maxLength ) L = obj.maxLength;

			var headLength = (obj.headLength >= L/2 )? L/2 : obj.headLength;
			var headSize = (obj.headSize >= L/2 )? L/2 : obj.headSize;

			var dir = molecule.atoms[ i ].force.clone().normalize();
			var position = molecule.atoms[ i ].CG.position.clone().add( dir.multiplyScalar( molecule.atoms[ i ].radius ) ) ;
			obj.CG.setLength( L, headLength, headSize );
			obj.CG.setDirection( dir );
			obj.CG.position.copy( position );
			obj.CG.visible = obj.visible;
		}


		if( molecule.atoms[ i ].dynamic && (molecule.atoms[ i ].records.position.length > molecule.atoms[ i ].trajectory.count) ){

			var pn1 = molecule.atoms[ i ].records.position.length - 1;
			var pn2 = molecule.atoms[ i ].trajectory.count;

			//頂点の位置座標の設定
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.position.array[ 3 * pn2 ] = molecule.atoms[ i ].records.position[ pn1 ].x;
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.position.array[ 3 * pn2 + 1 ] = molecule.atoms[ i ].records.position[ pn1 ].y;
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.position.array[ 3 * pn2 + 2 ] = molecule.atoms[ i ].records.position[ pn1 ].z;


			var r = Math.abs( molecule.atoms[ i ].records.velocity[ pn1 ].x / 10 );
			var g = Math.abs( molecule.atoms[ i ].records.velocity[ pn1 ].y / 10 );
			var b = Math.abs( molecule.atoms[ i ].records.velocity[ pn1 ].z / 10 );

			//頂点色の設定
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.color.array[ 3 * pn2 ] = r;
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.color.array[ 3 * pn2 + 1 ] = g;
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.color.array[ 3 * pn2 + 2 ] = b;
			//更新を実行するフラグ
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.position.needsUpdate = true;
			molecule.atoms[ i ].trajectory.CG.geometry.attributes.color.needsUpdate = true;
			molecule.atoms[ i ].trajectory.count++;
			molecule.atoms[ i ].trajectory.CG.geometry.setDrawRange( 0, molecule.atoms[ i ].trajectory.count );

		}

	}



	for( var i = 0; i< molecule.connects.length; i++ ){

		var ni = molecule.connects[ i ].pair1;
		var nj = molecule.connects[ i ].pair2;

		var Rij = new THREE.Vector3().subVectors(
			molecule.atoms[ ni ].position,
			molecule.atoms[ nj ].position
		);
		var Rij_g = new THREE.Vector3().addVectors(
			molecule.atoms[ ni ].position,
			molecule.atoms[ nj ].position
		).multiplyScalar( 0.5 );

		//結合タイプが剛体棒結合ではない場合はスキップ
		if( molecule.connects[ i ].type == PHYSLAB.LinearSpringConnection ) {
			molecule.connects[ i ].CG.setSpringBottomToTop(
				molecule.atoms[ molecule.connects[ i ].pair1 ].position,
				molecule.atoms[ molecule.connects[ i ].pair2 ].position
			);
		}
		//結合タイプが剛体棒結合ではない場合はスキップ
		if( molecule.connects[ i ].type == PHYSLAB.SolidConnection ) {

			var fij = new THREE.Vector3().subVectors(
				molecule.atoms[ ni ].force,
				molecule.atoms[ nj ].force
			)
			var r = Math.abs( fij.dot( Rij.clone().normalize() ) / 50);
			molecule.connects[ i ].CG.material.color.setRGB( 1, 1-r, 1-r);
			molecule.connects[ i ].CG.position.copy( Rij_g );
			molecule.connects[ i ].CG.lookAt( molecule.atoms[ ni ].position );

		}
		molecule.connects[ i ].CG.visible = visibleFlag;

	}


	//レンダリング
	renderer.render(scene, camera);

	//画像生成
	makePicture();

	//「loop()」関数の呼び出し
	requestAnimationFrame(loop);
}



//////////////////////////////////////////////
// 画像作成用
//////////////////////////////////////////////
var makePictureFlag = false;

//画像作成用イベント
window.addEventListener('keydown', function (e) {

	//キーボードイベント時のキー取得
	var keyChar = String.fromCharCode( e.keyCode ).toLowerCase();

	//キーボードの「s」が押された場合
	if(keyChar == "s") {
		makePictureFlag = true;
	}

});
//画像作成関数
function makePicture(){

	if( !makePictureFlag ) return;

	//グラフィックスが描画されたcanvas要素
	var canvas = renderer.domElement;

	//a要素の生成
	var a = document.createElement("a");
	//canvas要素→DataURL形式
	a.href = canvas.toDataURL("image/png");
	//PNGファイル名の命名
	a.download = "picture";
	a.innerHTML = "ダウンロード";

	//id="thumbnails"のdiv要素の子要素にa要素を追加
	document.getElementsByTagName( "body" )[0].appendChild(a);

	makePictureFlag = false;

}
