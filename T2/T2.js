import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneWired,
} from "../libs/util/util.js";
import KeyboardState from "../libs/util/KeyboardState.js";
//metodos definidos no construtores
import {
  initLight,
  gerarPlano,
  loadGLBFileAviao,
  createTroncoMaterial,
  createCopaMaterial,
  createBala,
  createAlvo,
  fadeInPlano,
} from "./construtores.js";

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

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
window.addEventListener("mousemove", onMouseMove);

// Variáveis do mouse
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

let velocidade = 2;

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
// Material da copa
let materialCopa = createCopaMaterial();

// Criação do avião
let aviaoInteiro = new THREE.Object3D();
aviaoInteiro.position.set(0, 60, 0);
loadGLBFileAviao(aviaoInteiro);
aviaoInteiro.scale.set(2, 2, 2);
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

document.addEventListener("click", function (event) {
  // Check if the primary button is pressed
  if (event.buttons === 0 && pauseAnimacao == true) {
    pauseAnimacao = false;
    velocidade = 10;
    canvas.style.cursor = "none";
    alvo.material.opacity = 0.6;
  } else if (event.buttons === 0) {
    let auxbala = createBala(scene, aviaoInteiro, cameraHolder, alvo);
    bala.push(auxbala);
    temBala = true;
  }
});

export const planos = [];
for (let i = 0; i < 6; i++) {
  const plano = createGroundPlaneWired(2000, 200, 15, 2);
  plano.material.color = new THREE.Color("rgb(0, 0, 43)");

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

  cube.name = "cubo";

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

// -- Create raycaster
let raycaster = new THREE.Raycaster();

// Enable layers to raycaster and camera (layer 0 is enabled by default)
raycaster.layers.enable(0);
camera.layers.enable(0);

// Create list of plane objects
let plane, planeGeometry, planeMaterial;
planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
planeMaterial = new THREE.MeshLambertMaterial();
planeMaterial.side = THREE.DoubleSide;
planeMaterial.transparent = true;
planeMaterial.opacity = 0.3;
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -150);
// camera.add(plane);

let alvo = createAlvo(scene);
alvo.position.set(0, 10, -50);
alvo.renderOrder = 999;
alvo.material.depthTest = false;

scene.add(alvo);

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

  if (aviaoInteiro.position.z % 200 === 0) {
    gerarPlano(planos, scene, aviaoInteiro, materialTronco, materialCopa); // Geração de planos
  }

  for (let index = 0; index < bala.length; index++) {
    if (bala[index].position.z <= aviaoInteiro.position.z - 1000) {
      scene.remove(bala[index]);
      bala.splice(index, 1);
    }
  }
}

function rotacaoMouse() {
  // Interação via mouse
  if (!pauseAnimacao) {
    targetX = mouseX * -0.003;
    targetY = mouseY * -0.003;
    alvo.position.x = 0.5 * mouseX;
    alvo.position.y = 0.5 * -mouseY;

    aviaoInteiro.position.x = 0.1 * mouseX;
    aviaoInteiro.position.y = -0.1 * mouseY;
    aviaoInteiro.position.z -= velocidade;

    aviaoInteiro.rotation.z = targetX * 0.75; // Rotação do avião no eixo z
    cameraHolder.position.z -= velocidade;
    targetObject.position.z -= velocidade;
    light.position.z -= velocidade;
    alvo.position.z -= velocidade;
    if (temBala) {
      for (let i = 0; i < bala.length; i++) bala[i].translateZ(-8 * velocidade);
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
  fadeInPlano(planos);

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
    velocidade = 0;
    pauseAnimacao = true;
    canvas.style.cursor = "pointer";
    alvo.material.opacity = 0;
  }
}

function onMouseMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  let pointer = new THREE.Vector2();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(alvo);

  // -- Find the selected objects ------------------------------
}
