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
  getMaxSize
} from "../libs/util/util.js";
import Grid from "../libs/util/grid.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {PLYLoader} from '../build/jsm/loaders/PLYLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';

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

let scene, renderer, camera, defaultMaterial, light; // Inicialização das variáveis globais
renderer = initRenderer(); // Inicialização do renderizador
camera = initCamera(new THREE.Vector3(0, 30, 20)); // Inicialização da câmera
defaultMaterial = setDefaultMaterial(); // Inicialização do material
scene = new THREE.Scene(); // Criação da cena
scene.background = new THREE.Color(0x87ceeb); // Cor de fundo da cena
light = initDefaultBasicLight(scene); // Inicialização da luz

// Material do tronco
let materialTronco = setDefaultMaterial("rgb(150,75,0)");
let materialTronco2 = setDefaultMaterial("rgb(150,75,0)");
materialTronco.transparent = true;
materialTronco2.transparent = true;
materialTronco.opacity = 0.1;
materialTronco2.opacity = 0.1;

// Material da copa
let materialArvore = setDefaultMaterial("rgb(0,128,0)");
let materialArvore2 = setDefaultMaterial("rgb(0,128,0)");
materialArvore.transparent = true;
materialArvore2.transparent = true;
materialArvore.opacity = 0.1;
materialArvore2.opacity = 0.1;

// Criação de planos
let plane = createGroundPlaneWired(2000, 1000);
let plane2 = createGroundPlaneWired(2000, 1000);
plane.name = "plano";
plane2.name = "plano2";
plane.material.color.setStyle("#9e7a5a");
plane2.material.color.setStyle("#9e7a5a");

// Posicionamento dos planos
plane.position.z = 0;
plane2.position.z = -1000;
scene.add(plane);
scene.add(plane2);


// Criação do avião
let aviaoInteiro = new THREE.Object3D();
aviaoInteiro.position.set(0, 60, 0);


loadGLBFile();
aviaoInteiro.scale.set(2,2,2);
// aviaoInteiro.rotateY(THREE.MathUtils.degToRad(90));
aviaoInteiro.rotateZ(THREE.MathUtils.degToRad(180));

scene.add(aviaoInteiro);




// // Base cilindrica do avião
// let geometriaCilindro = new THREE.CylinderGeometry(2, 1, 15, 20);
// let materialCilindro = setDefaultMaterial("Indigo");
// let cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro);
// cilindro.position.set(0.0, 5.0, 0.0);
// cilindro.rotateX(THREE.MathUtils.degToRad(-90));
// aviaoInteiro.add(cilindro);

// // Asa principal
// let geometriaAsaPrincipal = new THREE.SphereGeometry(0.5, 32, 16);
// geometriaAsaPrincipal.rotateZ(Math.PI / 2);
// geometriaAsaPrincipal.scale(22, 3.5, 0.75);
// let asaPrincipal = new THREE.Mesh(geometriaAsaPrincipal, defaultMaterial);
// cilindro.add(asaPrincipal);

// // Asa traseira direita
// let geometriaAsaTraseiraDireita = new THREE.SphereGeometry(0.5, 32, 16);
// geometriaAsaTraseiraDireita.rotateZ(Math.PI / 2);
// geometriaAsaTraseiraDireita.scale(3, 1, 0.75);
// let asaTraseiraDireita = new THREE.Mesh(
//   geometriaAsaTraseiraDireita,
//   defaultMaterial
// );
// asaTraseiraDireita.position.set(1.5, -7, 0.0);
// cilindro.add(asaTraseiraDireita);

// // Asa traseira superior
// let geometriaAsaTraseiraSuperior = new THREE.SphereGeometry(0.5, 32, 16);
// geometriaAsaTraseiraSuperior.rotateZ(Math.PI / 2);
// geometriaAsaTraseiraSuperior.scale(3, 1, 0.75);
// let asaTraseiraSuperior = new THREE.Mesh(
//   geometriaAsaTraseiraSuperior,
//   defaultMaterial
// );
// asaTraseiraSuperior.position.set(0.0, -7, 1);
// asaTraseiraSuperior.rotateY(THREE.MathUtils.degToRad(90));
// cilindro.add(asaTraseiraSuperior);

// // Asa traseira esquerda
// let geometriaAsaTraseiraEsquerda = new THREE.SphereGeometry(0.5, 32, 16);
// geometriaAsaTraseiraEsquerda.rotateZ(Math.PI / 2);
// geometriaAsaTraseiraEsquerda.scale(3, 1, 0.75);
// let asaTraseiraEsquerda = new THREE.Mesh(
//   geometriaAsaTraseiraEsquerda,
//   defaultMaterial
// );
// asaTraseiraEsquerda.position.set(-1.5, -7, 0.0);
// cilindro.add(asaTraseiraEsquerda);

// // Hélice
// let materialAroHelice = setDefaultMaterial("Goldenrod");
// let geometriaAroHelice = new THREE.TorusGeometry(2, 0.3, 30, 100);
// let aroHelice = new THREE.Mesh(geometriaAroHelice, materialAroHelice);
// aroHelice.position.set(0, 7.5, 0);
// aroHelice.rotateX(THREE.MathUtils.degToRad(90));
// cilindro.add(aroHelice);

// // Pá da hélice
// let materialPaHelice = setDefaultMaterial("grey");
// let geometriaPaHelice = new THREE.CylinderGeometry(2, 2, 0.5, 32);
// let paHelice = new THREE.Mesh(geometriaPaHelice, materialPaHelice);
// paHelice.material.opacity = 0;
// paHelice.position.set(0, 0, 0.1);
// paHelice.rotateX(THREE.MathUtils.degToRad(90));
// aroHelice.add(paHelice);

// // Cabine do piloto
// let materialCabine = setDefaultMaterial("lightgrey");
// let geometriaCabine = new THREE.CapsuleGeometry(1, 2.5, 10, 20);
// let cabine = new THREE.Mesh(geometriaCabine, materialCabine);
// cabine.position.set(0.0, 0.0, 1.0);
// cilindro.add(cabine);

// Câmera holder
let cameraHolder = new THREE.Object3D();
cameraHolder.rotateX(THREE.MathUtils.degToRad(45));
cameraHolder.position.set(0, 20, 30);
cameraHolder.add(camera);
scene.add(cameraHolder);

let contador = 0;

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
    materialTronco.opacity += 0.003;
    materialArvore.opacity += 0.005;
  } else {
    materialTronco2.opacity += 0.003;
    materialArvore2.opacity += 0.005;
  }

  // Atualização dos planos
  if (aviaoInteiro.position.z % 500 === 0 && aviaoInteiro.position.z !== 0) {
    if (contador == 0) {
      scene.getObjectByName("plano").removeFromParent();
      materialTronco.opacity = 0.05;
      materialArvore.opacity = 0.1;
      gerarPlano(plane); // Geração de planos
      contador = 1;
    } else if (contador == 1) {
      scene.getObjectByName("plano2").removeFromParent();
      materialTronco2.opacity = 0.05;
      materialArvore2.opacity = 0.1;
      gerarPlano2(plane2); // Geração de planos
      contador = 0;
    }
  }
}

function gerarPlano(plane) {
  // Geração de planos ímpares
  let planeGrid = new Grid(2000, 1000, 10, 10, "#969696", 3);

  plane.clear();
  plane.add(planeGrid);
  plane.position.z = aviaoInteiro.position.z - 750;
  scene.add(plane);

  let quantidade = 1 + Math.floor(Math.random() * 100);
  for (let index = 0; index < quantidade; index++) {
    // Geração de árvores dos planos
    createTree(plane);
  }
  loadGLBFile2(plane);
}

function gerarPlano2(plane) {
  // Geração de planos pares
  let planeGrid = new Grid(2000, 1000, 10, 10, "#969696", 3);

  plane.clear();
  plane.add(planeGrid);
  plane.position.z = aviaoInteiro.position.z - 750;
  scene.add(plane);

  let quantidade = 1 + Math.floor(Math.random() * 100);
  for (let index = 0; index < quantidade; index++) {
    // Geração de árvores dos planos
    createTree2(plane2);
  }
  loadGLBFile2(plane2);
}

function rotacaoMouse() {
  // Interação via mouse
  targetX = mouseX * -0.003;
  targetY = mouseY * -0.003;

  aviaoInteiro.position.x = 0.1 * mouseX;
  aviaoInteiro.position.y = -0.1 * mouseY;
  aviaoInteiro.position.z -= 5;

  aviaoInteiro.rotation.z = targetX * 0.75; // Rotação do avião no eixo z
  cameraHolder.position.z -= 5;
}

function createTree(plane) {
  // Tronco da árvore
  let aviaoInteiro = new THREE.Object3D();
  let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(
    -250 + Math.random() * 500.0,
    -125 + Math.random() * 375.0,
    7.5
  );

  aviaoInteiro.add(tronco);

  // Copa da árovore
  let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
  let arvore = new THREE.Mesh(arvoreGeometry, materialArvore);
  arvore.position.set(0.0, 7.5, 0);
  tronco.add(arvore);
  tronco.rotateX(THREE.MathUtils.degToRad(90));

  plane.add(aviaoInteiro);
}

function createTree2(plane) {
  // Tronco da árvore
  let aviaoInteiro = new THREE.Object3D();
  let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
  let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
  tronco.position.set(
    -250 + Math.random() * 500.0,
    -125 + Math.random() * 375.0,
    7.5
  );

  aviaoInteiro.add(tronco);

  // Copa da árovore
  let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
  let arvore = new THREE.Mesh(arvoreGeometry, materialArvore2);
  arvore.position.set(0.0, 7.5, 0);
  tronco.add(arvore);
  tronco.rotateX(THREE.MathUtils.degToRad(90));

  plane.add(aviaoInteiro);
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

function loadGLBFile()
{
   var loader = new GLTFLoader( );
   loader.load('aviao.glb', function ( gltf ) {
      var obj = gltf.scene;
      obj.name = 'aviao';

      obj.traverse( function ( child ) {
         if ( child ) {
            child.castShadow = true;
         }
      });
      obj.traverse( function( node )
      {
         if( node.material ) node.material.side = THREE.DoubleSide;
      });
       //obj.rotateZ(THREE.MathUtils.degToRad(0));
       obj.rotateY(THREE.MathUtils.degToRad(180));
      aviaoInteiro.add ( obj );        
    });
}

function loadGLBFile2(plane)
{
   var loader = new GLTFLoader( );
   loader.load('torreta.glb', function ( gltf ) {
      var obj = gltf.scene;
      obj.name = 'torreta';

      obj.traverse( function ( child ) {
         if ( child ) {
            child.castShadow = true;
         }
      });
      obj.traverse( function( node )
      {
         if( node.material ) node.material.side = THREE.DoubleSide;
      });
       //obj.rotateZ(THREE.MathUtils.degToRad(0));
       obj.rotateY(THREE.MathUtils.degToRad(0));
       plane.add ( obj );        
       obj.scale.set(10,10,10); 
       obj.position.set(-250 + Math.random() * 500.0,
       -125 + Math.random() * 375.0,
       1.5)
       obj.rotateX(THREE.MathUtils.degToRad(90));
       obj.rotateY(THREE.MathUtils.degToRad(270));
    });
}