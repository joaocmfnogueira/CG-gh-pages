import * as THREE from  'three';
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

// create a cube
let cubeGeometry = new THREE.BoxGeometry(1,1,1);
let cube = new THREE.Mesh(cubeGeometry, material);
cube.scale.set(11,0.3,6)
// position the cube
cube.translateY(3.15);

// add the cube to the scene
scene.add(cube);

//11,0.3,6
    
let cilindroGeometry = new THREE.CylinderGeometry( 0.2, 0.2, 3, 32 );
let cilindro1 = new THREE.Mesh(cilindroGeometry, material);
let cilindro2 = new THREE.Mesh(cilindroGeometry, material);
let cilindro3 = new THREE.Mesh(cilindroGeometry, material);
let cilindro4 = new THREE.Mesh(cilindroGeometry, material);

cilindro1.translateX(-5);
cilindro1.translateZ(-2.25);
cilindro1.translateY(1.5);
scene.add(cilindro1)

cilindro2.translateX(5);
cilindro2.translateZ(-2.25);
cilindro2.translateY(1.5);
scene.add(cilindro2)

cilindro3.translateX(5);
cilindro3.translateZ(2.25);
cilindro3.translateY(1.5);
scene.add(cilindro3)

cilindro4.translateX(-5);
cilindro4.translateZ(2.25);
cilindro4.translateY(1.5);
scene.add(cilindro4)

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