import * as THREE from 'three';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   setDefaultMaterial,
   onWindowResize
} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 0, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

// Mouse variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
document.addEventListener('mousemove', onDocumentMouseMove);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let mesh = new THREE.Mesh(cubeGeometry, material);
// position the cube
mesh.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(mesh);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
mesh.add(axesHelper);


render();
function render() {
   mouseRotation();
   requestAnimationFrame(render);
   renderer.render(scene, camera) // Render scene
}

function mouseRotation() {
   targetX = mouseX * .001;
   targetY = mouseY * .001;
   if (mesh) {
      mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
      mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
   }
}

function onDocumentMouseMove(event) {
   mouseX = (event.clientX - windowHalfX);
   mouseY = (event.clientY - windowHalfY);
}