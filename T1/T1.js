import * as THREE from "three";
import { MathUtils } from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ,
  createGroundPlaneWired,
} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Mouse variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
document.addEventListener("mousemove", onDocumentMouseMove);

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

//create wiredframe groud
let plane = createGroundPlaneWired(500, 500);
scene.add(plane);

//objeto aviao
let aviaoInteiro = new THREE.Object3D();
scene.add(aviaoInteiro);

//base cilindrica do avião
let materialCorpo = setDefaultMaterial("Indigo");
let cilinderGeometry = new THREE.CylinderGeometry(2, 1, 15, 20);
let cilinder = new THREE.Mesh(cilinderGeometry, materialCorpo);
cilinder.position.set(0.0, 5.0, 0.0);
cilinder.rotateX(THREE.MathUtils.degToRad(-90));
aviaoInteiro.add(cilinder);

//asa
let ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
ellipsoidGeometry.rotateZ(Math.PI / 2);
ellipsoidGeometry.scale(22, 3.5, 0.75);
let ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
cilinder.add(ellipsoidMesh);

//asaTrasDireita
let ellipsoidGeometry2 = new THREE.SphereGeometry(0.5, 32, 16);
ellipsoidGeometry2.rotateZ(Math.PI / 2);
ellipsoidGeometry2.scale(3, 1, 0.75);
let ellipsoidMesh2 = new THREE.Mesh(ellipsoidGeometry2, material);
ellipsoidMesh2.position.set(1.5, -7, 0.0);
cilinder.add(ellipsoidMesh2);

//asaTrasSuperior
let ellipsoidGeometry3 = new THREE.SphereGeometry(0.5, 32, 16);
ellipsoidGeometry3.rotateZ(Math.PI / 2);
ellipsoidGeometry3.scale(3, 1, 0.75);
let ellipsoidMesh3 = new THREE.Mesh(ellipsoidGeometry3, material);
ellipsoidMesh3.position.set(0.0, -7, 1);
ellipsoidGeometry3.rotateY(THREE.MathUtils.degToRad(90));
cilinder.add(ellipsoidMesh3);

//asaTrasEsquerda
let ellipsoidGeometry4 = new THREE.SphereGeometry(0.5, 32, 16);
ellipsoidGeometry4.rotateZ(Math.PI / 2);
ellipsoidGeometry4.scale(3, 1, 0.75);
let ellipsoidMesh4 = new THREE.Mesh(ellipsoidGeometry4, material);
ellipsoidMesh4.position.set(-1.5, -7, 0.0);
cilinder.add(ellipsoidMesh4);

//frente
let materialFrente = setDefaultMaterial("Goldenrod");
let frenteGeometry = new THREE.TorusGeometry(2, 0.3, 30, 100);
let frente = new THREE.Mesh(frenteGeometry, materialFrente);
frente.position.set(0, 7.5, 0);
frente.rotateX(THREE.MathUtils.degToRad(90));
cilinder.add(frente);

let materialFrente2 = setDefaultMaterial("grey");
let frenteGeometry2 = new THREE.CylinderGeometry(2, 2, 0.5, 32);
let frente2 = new THREE.Mesh(frenteGeometry2, materialFrente2);
frente2.material.opacity = 0;
frente2.position.set(0, 0, 0.1);
frente2.rotateX(THREE.MathUtils.degToRad(90));
frente.add(frente2);

//cabine do piloto
let materialCabine = setDefaultMaterial("lightgrey");
let cabine = new THREE.CapsuleGeometry(1, 2.5, 10, 20);
let capsule = new THREE.Mesh(cabine, materialCabine);
capsule.position.set(0.0, 0.0, 1.0);
cilinder.add(capsule);

createTree();

let cameraHolder = new THREE.Object3D();
cameraHolder.rotateX(THREE.MathUtils.degToRad(110));

cameraHolder.add(camera);

cilinder.add(cameraHolder);

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

/*
**********************************************************************
A partir daqui, tem definição das funções e metodos chamados no começo
**********************************************************************
*/

function render() {
  //descomente para testar camera do aviao
  mouseRotation();
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}

function mouseRotation() {
  targetX = mouseX * -0.003;
  targetY = mouseY * -0.003;
  if (aviaoInteiro) {
    aviaoInteiro.rotation.y += 0.05 * (targetX - aviaoInteiro.rotation.y);
    aviaoInteiro.rotation.x += 0.05 * (targetY - aviaoInteiro.rotation.x);
    aviaoInteiro.translateZ(-0.1);
  }
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function createTree() {
  //tronco da árvore
  let materialTronco = setDefaultMaterial("rgb(150,75,0)");
  let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(7.0, 7.5, 15.0);
  scene.add(tronco);

  //copa da árovore
  let materialArvore = setDefaultMaterial("rgb(0,128,0)");
  let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
  let arvore = new THREE.Mesh(arvoreGeometry, materialArvore);
  arvore.position.set(0.0, 7.5, 0);
  tronco.add(arvore);
}
