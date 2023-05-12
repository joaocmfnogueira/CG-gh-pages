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
  createLightSphere
} from "../libs/util/util.js";
import Grid from "../libs/util/grid.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {PLYLoader} from '../build/jsm/loaders/PLYLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
//metodos definidos no construtores
import {
  initLight,
  createTree,
  gerarPlano,
  loadGLBFileAviao,
  createTroncoMaterial,
  createCopaMaterial,

} from './construtores.js';


const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", onDocumentMouseMove);
window.addEventListener(
  "resize",
  () => {
    onWindowResize(camera, renderer);
  },
  false
); // Listen window size changes

// Variáveis do mouse
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

let scene, renderer, camera, defaultMaterial; // Inicialização das variáveis globais
renderer = initRenderer(); // Inicialização do renderizador

camera = initCamera(new THREE.Vector3(0, 30, 20)); // Inicialização da câmera
defaultMaterial = setDefaultMaterial(); // Inicialização do material
scene = new THREE.Scene(); // Criação da cena
scene.background = new THREE.Color(0x87ceeb); // Cor de fundo da cena
// light = initDefaultBasicLight(scene); // Inicialização da luz
let lightPosition = new THREE.Vector3(10, 30, -20);

let light = initLight(lightPosition, scene); // local function
scene.add(light);


// Materiais da Árvore
// Material do tronco
let materialTronco = createTroncoMaterial();
let materialTronco2 = createTroncoMaterial();
// Material da copa
let materialArvore = createCopaMaterial();;
let materialArvore2 = createCopaMaterial();


// Criação de planos
let plane = createGroundPlaneWired(2000, 1000);
let plane2 = createGroundPlaneWired(2000, 1000);
plane.name = "plano";
plane2.name = "plano2";
plane.receiveShadow = true;
plane2.receiveShadow = true;
// Posicionamento dos planos
plane.position.z = 0;
plane2.position.z = -1000;
scene.add(plane);
scene.add(plane2);

// Criação do avião
let aviaoInteiro = new THREE.Object3D();
aviaoInteiro.position.set(0, 60, 0);
loadGLBFileAviao(aviaoInteiro);
aviaoInteiro.scale.set(2,2,2);
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

let contador = 0;

//definição do target para o funcionamento da sombra acompanhando o avião
let targetObject = new THREE.Object3D(); 
scene.add(targetObject);
light.target = targetObject;
render();

/*
**********************************************************************
A partir daqui, tem definição das funções e metodos chamados no começo
**********************************************************************
*/

// Atualização dos materiais e planos
function atualizarObjetos() {
  // Dinâmica do ambiente - fade in
  if (contador == 1) {
    materialTronco.opacity += 0.016;
    materialArvore.opacity += 0.019;
  } else {
    materialTronco2.opacity += 0.016;
    materialArvore2.opacity += 0.019;
  }

  // Atualização dos planos
  if (aviaoInteiro.position.z % 500 === 0 && aviaoInteiro.position.z !== 0) {
    if (contador == 0) {
      scene.getObjectByName("plano").removeFromParent();
      materialTronco.opacity = 0.0001;
      materialArvore.opacity = 0.3;
      gerarPlano(plane, scene, aviaoInteiro, materialTronco, materialArvore); // Geração de planos
      contador = 1;
    } else if (contador == 1) {
      scene.getObjectByName("plano2").removeFromParent();
      materialTronco2.opacity = 0.0001;
      materialArvore2.opacity = 0.3;
      gerarPlano(plane2, scene, aviaoInteiro, materialTronco2, materialArvore2); // Geração de planos
      contador = 0;
    }
  }
}

function rotacaoMouse() {
  // Interação via mouse
  targetX = mouseX * -0.003;
  targetY = mouseY * -0.003;

  const velocidade = 10;

  aviaoInteiro.position.x = 0.1 * mouseX;
  aviaoInteiro.position.y = -0.1 * mouseY;
  aviaoInteiro.position.z -= velocidade;

  aviaoInteiro.rotation.z = targetX * 0.75; // Rotação do avião no eixo z
  cameraHolder.position.z -= velocidade;
  targetObject.position.z -= velocidade;
  light.position.z -= velocidade;

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
  renderer.render(scene, camera);
}




