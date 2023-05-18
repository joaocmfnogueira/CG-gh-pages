import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneWired,
  getMaxSize,
  SecondaryBox,
  createLightSphere,
} from "../libs/util/util.js";
import Grid from "../libs/util/grid.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../build/jsm/loaders/OBJLoader.js";
import { PLYLoader } from "../build/jsm/loaders/PLYLoader.js";
import { MTLLoader } from "../build/jsm/loaders/MTLLoader.js";
import KeyboardState from "../libs/util/KeyboardState.js";
//metodos definidos no construtores
import {
  initLight,
  createTree,
  gerarPlano,
  loadGLBFileAviao,
  createTroncoMaterial,
  createCopaMaterial,
  createBala,
  rayCaster,
} from "./construtores.js";

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let clock = new THREE.Clock();
let keyboard = new KeyboardState();
// var infoBox = new SecondaryBox("");

document.addEventListener("mousemove", onDocumentMouseMove);
window.addEventListener(
  "resize",
  () => {
    onWindowResize(camera, renderer);
  },
  false
); // Listen window size changes
// window.addEventListener('mousemove', onMouseMove);

// Variáveis do mouse
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

let velocidade = 10;
let auxvelocidade;

let pauseAnimacao = false;

// lista de balas e condicional auxiliar 
let temBala = false;
let bala = [];

let scene, renderer, camera, defaultMaterial; // Inicialização das variáveis globais
renderer = initRenderer(); // Inicialização do renderizador

camera = initCamera(new THREE.Vector3(0, 50, 40)); // Inicialização da câmera
defaultMaterial = setDefaultMaterial(); // Inicialização do material
scene = new THREE.Scene(); // Criação da cena
scene.background = new THREE.Color(0x87ceeb); // Cor de fundo da cena

//adicionando luz direcional e horizontal
let lightPosition = new THREE.Vector3(375, 750, -900);
let light = initLight(lightPosition, scene); // local function
scene.add(light);

// Materiais da Árvore
// Material do tronco
let materialTronco = createTroncoMaterial();
let materialTronco2 = createTroncoMaterial();
// Material da copa
let materialCopa = createCopaMaterial();
let materialCopa2 = createCopaMaterial();

// Criação do avião
let aviaoInteiro = new THREE.Object3D();
aviaoInteiro.position.set(0, 60, 0);
loadGLBFileAviao(aviaoInteiro);
aviaoInteiro.scale.set(2, 2, 2);
// aviaoInteiro.rotateY(THREE.MathUtils.degToRad(90));
aviaoInteiro.rotateZ(THREE.MathUtils.degToRad(180));
aviaoInteiro.castShadow = true;
scene.add(aviaoInteiro);

// Câmera holder
let cameraHolder = new THREE.Object3D();
cameraHolder.rotateX(THREE.MathUtils.degToRad(45));
cameraHolder.position.set(0, 20, 30);
cameraHolder.add(camera);
scene.add(cameraHolder);

// Target, para auxiliar a sombra
let targetObject = new THREE.Object3D();
scene.add(targetObject);
light.target = targetObject;

let contador = 0;

document.addEventListener("click", function (event) {
  // Check if the primary button is pressed
  if (event.buttons === 0 && pauseAnimacao == true) {
    pauseAnimacao = false;
    velocidade = 10;
    canvas.style.cursor = "none";
  }
  else
  if (event.buttons === 0 ){
    let auxbala = createBala(scene, aviaoInteiro);
    bala.push(auxbala);
    temBala = true;
  }
});

export const planos = [];
for (let i = 0; i < 6; i++) {
  const plano = createGroundPlaneWired(2000, 200, 15, 2);
  plano.position.z = aviaoInteiro.position.z - i * 200;
  gerarPlano(plano, scene, aviaoInteiro, materialTronco, materialCopa); // Geração de planos

  const geometry = new THREE.BoxGeometry(200, 200, 200, 32, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x3c1e96,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  const cube = new THREE.Mesh(geometry, material);
  const cube2 = new THREE.Mesh(geometry, material);

  const geo = new THREE.EdgesGeometry(geometry, 1);
  const mat = new THREE.LineBasicMaterial({ color: 0x969696 });

  const wireframe = new THREE.LineSegments(geo, mat);
  const wireframe2 = new THREE.LineSegments(geo, mat);

  cube.add(wireframe);
  cube2.add(wireframe2);

  plano.add(cube);
  plano.add(cube2);

  cube.position.x = 300;
  cube.position.z = 100;

  cube2.position.x = -300;
  cube2.position.z = 100;

  scene.add(plano);
  planos.push(plano);
}
const geometry = new THREE.BoxGeometry(5, 5, 5, 32, 32, 32);
const material = new THREE.MeshPhongMaterial({
  color: 0x3c1e96,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1,
});

const cube = new THREE.Mesh(geometry, material);

const geo = new THREE.EdgesGeometry(geometry, 1);
const mat = new THREE.LineBasicMaterial({ color: 0x969696 });

const wireframe = new THREE.LineSegments(geo, mat);

cube.add(wireframe);

cube.position.x = 0;
cube.position.y = 0;
cube.position.z = -700;

scene.add(cube);

// // -- Create raycaster
// let raycaster = new THREE.Raycaster();

// // Enable layers to raycaster and camera (layer 0 is enabled by default)
// raycaster.layers.enable( 0 );
// camera.layers.enable( 0 );

// // Create list of plane objects 
// let plane, planeGeometry, planeMaterial;
//    planeGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
//    planeMaterial = new THREE.MeshLambertMaterial();
//    planeMaterial.side = THREE.DoubleSide;
//    planeMaterial.transparent = true;
//    planeMaterial.opacity = 0.8;
//    plane = new THREE.Mesh(planeGeometry, planeMaterial);
//    plane.position.set(0,-50,-100);
//    camera.add(plane);


// // Object to represent the intersection point
// let intersectionSphere = new THREE.Mesh(
//    new THREE.SphereGeometry(10.2, 30, 30, 0, Math.PI * 2, 0, Math.PI),
//    new THREE.MeshPhongMaterial({color:"orange", shininess:"200"}));
// scene.add(intersectionSphere);

render();

/*
**********************************************************************
A partir daqui, tem definição das funções e metodos chamados no começo
**********************************************************************
*/

// Atualização dos materiais e planos
function atualizarObjetos() {
  materialTronco.opacity = 1;
  materialCopa.opacity = 1;

  // Dinâmica do ambiente - fade in
  // if (contador == 1) {
  //   materialTronco.opacity += 0.016;
  //   materialCopa.opacity += 0.019;
  // } else {
  //   materialTronco2.opacity += 0.016;
  //   materialCopa2.opacity += 0.019;
  // }

  if (aviaoInteiro.position.z % 200 === 0) {
    // materialTronco.opacity = 1;
    // materialCopa.opacity = 1;
    gerarPlano(planos, scene, aviaoInteiro, materialTronco, materialCopa); // Geração de planos
  }

  for (let index = 0; index < bala.length; index++) {
       if(bala[index].position.z <= aviaoInteiro.position.z - 1000){
            scene.remove(bala[index]);
            bala.splice(index,1);
            console.log(bala);
            
       }
  }

  // while (true) {
  // if (aviaoInteiro.position.z % 500 === 0) {
  //   const plano = createGroundPlaneWired(2000, 10000);
  //   scene.add(plano);
  // }
  // }

  // Atualização dos planos
  // if (aviaoInteiro.position.z % 500 === 0 && aviaoInteiro.position.z !== 0) {
  //   materialTronco.opacity = 0.0001;
  //   materialCopa.opacity = 0.3;
  //   gerarPlano(plano, scene, aviaoInteiro, materialTronco, materialCopa); // Geração de planos

  //   // if (contador == 0) {
  //   //   // scene.getObjectByName("plano").removeFromParent();
  //   //   materialTronco.opacity = 0.0001;
  //   //   materialCopa.opacity = 0.3;
  //   //   gerarPlano(plane, scene, aviaoInteiro, materialTronco, materialCopa); // Geração de planos
  //   //   contador = 1;
  //   // } else if (contador == 1) {
  //   //   // scene.getObjectByName("plano2").removeFromParent();
  //   //   // materialTronco2.opacity = 0.0001;
  //   //   // materialCopa2.opacity = 0.3;
  //   //   gerarPlano(plane2, scene, aviaoInteiro, materialTronco2, materialCopa2); // Geração de planos
  //   //   contador = 0;
  //   // }
  // }
}

function rotacaoMouse() {
  // Interação via mouse
  if (!pauseAnimacao) {
    targetX = mouseX * -0.003;
    targetY = mouseY * -0.003;

    aviaoInteiro.position.x = 0.1 * mouseX;
    aviaoInteiro.position.y = -0.1 * mouseY;
    aviaoInteiro.position.z -= velocidade;

    aviaoInteiro.rotation.z = targetX * 0.75; // Rotação do avião no eixo z
    cameraHolder.position.z -= velocidade;
    targetObject.position.z -= velocidade;
    light.position.z -= velocidade;
    if(temBala){
      for(let i = 0; i < bala.length; i++)
      bala[i].position.z -= 3*velocidade;
      console.log(bala);
    }
  }
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

let canvas = document.querySelector("canvas");
canvas.style.cursor = "none"; // Ocultar cursor do mouse

function render() {
  rotacaoMouse();
  atualizarObjetos();
  requestAnimationFrame(render);
  keyboardUpdate();

  renderer.render(scene, camera);
}

function keyboardUpdate() {
  keyboard.update();
  // Keyboard.down - execute only once per key pressed
  if (keyboard.down("1")) velocidade = 5;
  if (keyboard.down("2")) velocidade = 10;
  if (keyboard.down("3")) velocidade = 20;

  if (keyboard.pressed("esc")) {
    auxvelocidade = velocidade;
    console.log(auxvelocidade);
    velocidade = 0;
    pauseAnimacao = true;
    canvas.style.cursor = "pointer";
  }
}

// function onMouseMove(event) 
// {
//    leftBox.changeMessage("Intersection: None");
//    intersectionSphere.visible = false;
//    // calculate pointer position in normalized device coordinates
// 	// (-1 to +1) for both components
//    let pointer = new THREE.Vector2();
//    pointer.x =  (event.clientX / window.innerWidth) * 2 - 1;
//    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

//    // update the picking ray with the camera and pointer position
//    raycaster.setFromCamera(pointer, camera);
//    // calculate objects intersecting the picking ray
//    let intersects = raycaster.intersectObjects(objects);

//    // -- Find the selected objects ------------------------------
//    if (intersects.length > 0) // Check if there is a intersection
//    {      
//       let point = intersects[0].point; // Pick the point where interception occurrs
//       intersectionSphere.visible = true;
//       intersectionSphere.position.set(point.x, point.y, point.z);

//       for (let i = 0; i < objects.length; i++)
//       {   
//          if(objects[i] == intersects[0].object ) {
//             clearSelected(); // Removes emissive for all layers 
//             objects[i].material.emissive.setRGB(0.4, 0.4, 0.4);
//             showInterceptionCoords(i, point);
//          }
//       }
//    }
// };
