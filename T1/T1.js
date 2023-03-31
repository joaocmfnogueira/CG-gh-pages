import * as THREE from  'three';
import { MathUtils } from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// // create a cube
// let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
// let cube = new THREE.Mesh(cubeGeometry, material);
// // position the cube
// cube.position.set(0.0, 2.0, 0.0);
// // add the cube to the sceneW
// scene.add(cube);

//base do avião
let cilinderGeometry = new THREE.CylinderGeometry(2, 1, 15,20);
let cilinder = new THREE.Mesh(cilinderGeometry, material);
cilinder.position.set(0.0, 5.0, 0.0);
cilinder.rotateX(THREE.MathUtils.degToRad(-90)); 
scene.add(cilinder);

//asa

const length = 12, width = 8;

const shape = new THREE.Shape();
shape.moveTo( 0,0 );
shape.lineTo( 0, width );
shape.lineTo( length, width );
shape.lineTo( length, 0 );
shape.lineTo( 0, 0 );

const extrudeSettings = {
	steps: 10,
	depth: 10,
	bevelEnabled: true,
	bevelThickness: 5,
	bevelSize: 0.5,
	bevelOffset: -4,
	bevelSegments: 5
};

//asa
let asaGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings );
let asa = new THREE.Mesh(asaGeometry, material);
cilinder.add(asa);
asa.rotateZ(THREE.MathUtils.degToRad(0))
asa.rotateX(THREE.MathUtils.degToRad(-90))
asa.rotateY(THREE.MathUtils.degToRad(-90))
asa.position.set(5, -6, 4);

//frente
let frenteGeometry = new THREE.TorusGeometry( 2, 0.3, 30, 100 );
let frente = new THREE.Mesh(frenteGeometry, material);
frente.position.set(0,7.85,0)
frente.rotateX(THREE.MathUtils.degToRad(90));

cilinder.add(frente);

//frente.position.set(5, -6, 4);



// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

