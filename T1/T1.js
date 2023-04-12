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
import Grid from "../libs/util/grid.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 30, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Mouse variables
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

//material do tronco
let materialTronco = setDefaultMaterial("rgb(150,75,0)");
  materialTronco.transparent = true;
  materialTronco.opacity = 0.1;
//material da copa
let materialArvore = setDefaultMaterial("rgb(0,128,0)");
  materialArvore.transparent = true;
  materialArvore.opacity = 0.1;


//material do tronco do plano 2
let materialTronco2 = setDefaultMaterial("rgb(150,75,0)");
  materialTronco2.transparent = true;
  materialTronco2.opacity = 0.1;
//material da copa do plano 2
let materialArvore2 = setDefaultMaterial("rgb(0,128,0)");
  materialArvore2.transparent = true;
  materialArvore2.opacity = 0.1;

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
plane.name = 'plano';
scene.add(plane);
plane.position.z = -250;

let plane2 = createGroundPlaneWired(500, 500);
plane2.name = 'plano2';
plane2.position.z = -750;
scene.add(plane2);


//objeto aviao
let aviaoInteiro = new THREE.Object3D();
scene.add(aviaoInteiro);
aviaoInteiro.position.set(0,0,0);

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

//createTree();
let cameraHolder = new THREE.Object3D();
cameraHolder.rotateX(THREE.MathUtils.degToRad(45));
cameraHolder.rotateY(THREE.MathUtils.degToRad(0));
cameraHolder.rotateZ(THREE.MathUtils.degToRad(0));

cameraHolder.add(camera);
scene.add(cameraHolder);
cameraHolder.position.set(0,20,40);
//cilinder.add(cameraHolder);

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();


let contador = 0;
render();

/*
**********************************************************************
A partir daqui, tem definição das funções e metodos chamados no começo
**********************************************************************
*/

function render() {
  //descomente para testar camera do aviao
  mouseRotation();
  if(contador == 1){
    materialTronco.opacity += 0.003;
    materialArvore.opacity += 0.005;
  }
  else{
    materialTronco2.opacity += 0.003;
    materialArvore2.opacity += 0.005;
  }
  
  if(aviaoInteiro.position.z%500 == 0){
    if(contador == 0){
      scene.getObjectByName('plano').removeFromParent();
      materialTronco.opacity = 0.05;
      materialArvore.opacity = 0.1;
      gerarPlano(plane);
      contador = 1;
    }
    else if(contador == 1){
      scene.getObjectByName('plano2').removeFromParent();
      materialTronco2.opacity = 0.05;
      materialArvore2.opacity = 0.1;
      gerarPlano2(plane2);
      contador = 0;
    }
    
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}

function gerarPlano(plane){
plane.clear();
let wcolor = "rgb(150, 150, 150)";

var planeGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);
   planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper

   // Create the grid object
let grid = new Grid(500, 500, 10, 10, wcolor, 3);

plane.add(grid); // Add the grid to the plane
scene.add(plane);
plane.position.z = aviaoInteiro.position.z - 750;


//criar quantidade aleatoria de árvores
var quantidade = 1 + Math.floor(Math.random()*5);
for (let index = 0; index < quantidade; index++) {
  createTree(plane);
}
//createTree(plane);
}

function gerarPlano2(plane){
plane.clear();

let wcolor = "rgb(150, 150, 150)";

var planeGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);
   planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
   // Create the grid object
let grid = new Grid(500, 500, 10, 10, wcolor, 3);

plane.add(grid); // Add the grid to the plane

scene.add(plane);
plane.position.z = aviaoInteiro.position.z - 750;
  
  
  //criar quantidade aleatoria de árvores
  var quantidade = 1 + Math.floor(Math.random()*5);
  for (let index = 0; index < quantidade; index++) {
    createTree2(plane2);
  }
  //createTree(plane);
  }

function mouseRotation() {
  targetX = mouseX * -0.003;
  targetY = mouseY * -0.003;

  if (aviaoInteiro) {
    //  aviaoInteiro.rotation.y += 0.05 * (targetX - aviaoInteiro.rotation.y);
    //  aviaoInteiro.rotation.x += 0.05 * (targetY - aviaoInteiro.rotation.x);

    // if(2*aviaoInteiro.rotation.y >= 0){
    //   aviaoInteiro.rotation.z += 0.02 ;
    // }
    // else if(2*aviaoInteiro.rotation.y < 0){
    //   aviaoInteiro.rotation.z -= 0.02 ;
    // }
     aviaoInteiro.position.y = -0.1*mouseY;
     aviaoInteiro.position.x = 0.1*mouseX;

  }
  aviaoInteiro.position.z -= 5;
  cameraHolder.position.z -= 5;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

}

function createTree(plane) {
  //tronco da árvore
  let aviaoInteiro = new THREE.Object3D();
  let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(-250 + Math.random()*500.0,-125 + Math.random()*375.0, 7.5);

  aviaoInteiro.add(tronco);

  //copa da árovore

  let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
  let arvore = new THREE.Mesh(arvoreGeometry, materialArvore);
  arvore.position.set(0.0, 7.5, 0);
  tronco.add(arvore);
  tronco.rotateX(THREE.MathUtils.degToRad(90));

  plane.add(aviaoInteiro);
}

function createTree2(plane) {
  //tronco da árvore
  let aviaoInteiro = new THREE.Object3D();
  let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(-250 + Math.random()*500.0,-125 + Math.random()*375.0, 7.5);

  aviaoInteiro.add(tronco);

  //copa da árovore

  let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
  let arvore = new THREE.Mesh(arvoreGeometry, materialArvore2);
  arvore.position.set(0.0, 7.5, 0);
  tronco.add(arvore);
  tronco.rotateX(THREE.MathUtils.degToRad(90));

  plane.add(aviaoInteiro);
}
