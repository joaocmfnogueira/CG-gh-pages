import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        initDefaultSpotlight,
        InfoBox,
        onWindowResize,
        createLightSphere,
        createGroundPlaneXZ} from "../libs/util/util.js";
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
//scene.add(dirLight);  

// Load default scene
loadLightPostScene(scene)

//---------------------------------------------------------
// Default light intensity, position, color, ambient color and intensity
let lightPosition = new THREE.Vector3(-8.4, 3.0, 0.0);
let lightTarget = new THREE.Vector3(2.5, 0.0, 0.0);
let lightColor = "rgb(255,255,255)";
let ambientColor = "rgb(50,50,50)";

let ambientLight = new THREE.AmbientLight(ambientColor);
ambientLight.intensity = .1;
scene.add( ambientLight );

let spotLight = new THREE.SpotLight(lightColor);
setSpotLight(lightPosition, lightTarget);

// Create helper for the spotlight
const spotHelper = new THREE.SpotLightHelper(spotLight, 0xFF8C00);
//scene.add(spotHelper);

// Sphere to represent the light
let lightSphere = createLightSphere(scene, 0.05, 10, 10, lightPosition);



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a teapot
let material1 = new THREE.MeshPhongMaterial({
  color: "rgb(255,20,20)",
  shininess:"200",
  flatShading: false
})
let cubeGeometry = new TeapotGeometry(2);;
let cube = new THREE.Mesh(cubeGeometry, material1);
// position the cube
cube.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cube);

// create a esfera
let material2 = new THREE.MeshPhongMaterial({
  color: "rgb(97,213,132)",
  flatShading: false
})
let esferaGeometry= new THREE.SphereGeometry(2, 32, 16);
let esfera = new THREE.Mesh(esferaGeometry, material2);
// position the esfera
esfera.position.set(6.0, 2.0, 6.0);
// add the esfera to the scene
scene.add(esfera);

// create a cilindro
let material3 = new THREE.MeshPhongMaterial({
  color: "rgb(114,255,228)",
  flatShading: true
})
let cilindroGeometry= new THREE.CylinderGeometry(0.5, 3, 8, 16);
let cilindro = new THREE.Mesh(cilindroGeometry, material3);
// position the cilindro
cilindro.position.set(-6.0, 4.0, -6.0);
// add the cilindro to the scene
scene.add(cilindro);

// // Use this to show information onscreen
// let controls = new InfoBox();
//   controls.add("Basic Scene");
//   controls.addParagraph();
//   controls.add("Use mouse to interact:");
//   controls.add("* Left button to rotate");
//   controls.add("* Right button to translate (pan)");
//   controls.add("* Scroll to zoom in/out.");
//   controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function setSpotLight(position, target)
{
  spotLight.position.copy(position);
  spotLight.target.position.copy(target);
  spotLight.target.updateMatrixWorld();

  //spotLight.target.set(10, 0, 0);
  spotLight.angle = THREE.MathUtils.degToRad(45); 
  spotLight.intensity = 0.6;   
  spotLight.decay = 2; // The amount the light dims along the distance of the light.
  spotLight.penumbra = 0.5; // Percent of the spotlight cone that is attenuated due to penumbra. 

    // Shadow settings
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.name = "Spot Light"

  scene.add(spotLight);
}

function updateLight() {
  spotLight.target.updateMatrixWorld();
  lightSphere.position.copy(spotLight.position);
 // spotLight.shadow.camera.updateProjectionMatrix();     
  spotHelper.update();
}