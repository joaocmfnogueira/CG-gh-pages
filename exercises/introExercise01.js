import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        createGroundPlaneWired} from "../libs/util/util.js";

let scene, renderer, camera, material, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
let lightPosition = new THREE.Vector3(0, 4, 2);
let light = initLight(lightPosition);
//light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneWired(20, 20)
plane.receiveShadow = true;
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cubeGeometry2 = new THREE.BoxGeometry(3, 3, 3);
let cubeGeometry3 = new THREE.BoxGeometry(2, 2, 2);
let cube = new THREE.Mesh(cubeGeometry, material);
let cube2 = new THREE.Mesh(cubeGeometry2, material);
let cube3 = new THREE.Mesh(cubeGeometry3, material);
// position the cube
cube.position.set(0.0, 2.0, 0.0);

cube2.position.set(0.0, 2.0, 6.0);

cube3.position.set(6.0, 2.0, 6.0);

cube.castShadow = true;
cube2.castShadow = true;
cube3.castShadow = true;

// add the cube to the scene
scene.add(cube);
scene.add(cube2);
scene.add(cube3);

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

export function initLight(position) 
{
  const ambientLight = new THREE.HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
    0.5, // intensity
  );

  const mainLight = new THREE.DirectionalLight('white', 0.7);
    mainLight.position.copy(position);
    mainLight.castShadow = true;
   
  const shadow = mainLight.shadow;
    shadow.mapSize.width  =  512; 
    shadow.mapSize.height =  512; 
    shadow.camera.near    =  0.1; 
    shadow.camera.far     =  50; 
    shadow.camera.left    = -8.0; 
    shadow.camera.right   =  8.0; 
    shadow.camera.bottom  = -8.0; 
    shadow.camera.top     =  8.0; 

  scene.add(ambientLight);
  scene.add(mainLight);

  return mainLight;
}