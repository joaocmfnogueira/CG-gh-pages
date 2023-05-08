import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import GUI from '../libs/util/dat.gui.module.js'
let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

const lerpConfig = {
    destination: new THREE.Vector3(0.0, 1, 0.0),
    alpha: 0.01,
    move: true
  }


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a sphere1
let sphereGeometry = new THREE.SphereGeometry(1,32,32);
let sphere = new THREE.Mesh(sphereGeometry, material);
// position the cube
sphere.position.set(-8.0, 1.0, 5.0);
// add the cube to the scene
scene.add(sphere);

// create a sphere2
let sphereGeometry2 = new THREE.SphereGeometry(1,32,32);
let sphere2 = new THREE.Mesh(sphereGeometry2, material);
// position the cube
sphere2.position.set(-8.0, 1.0, -5.0);
// add the cube to the scene
scene.add(sphere2);

// // Use this to show information onscreen
// let controls = new InfoBox();
//   controls.add("Basic Scene");
//   controls.addParagraph();
//   controls.add("Use mouse to interact:");
//   controls.add("* Left button to rotate");
//   controls.add("* Right button to translate (pan)");
//   controls.add("* Scroll to zoom in/out.");
//   controls.show();

buildInterface();
render();

function render()
{
  requestAnimationFrame(render);
  if(lerpConfig.move) sphere.position.lerp(lerpConfig.destination, lerpConfig.alpha);
  renderer.render(scene, camera) // Render scene
}

function buildInterface()
{
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.onPlayAnimation = function(){
      playAction = !playAction;
    };
    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onPlayAnimation').name("Esfera 1");
  gui.add(controls, 'onPlayAnimation').name("Esfera 2");
  gui.add(controls, 'onPlayAnimation').name("Reset");
  gui.add(controls, 'viewAxes', false)
  .name("View Axes")
  .onChange(function(e) { controls.onViewAxes() });
}

