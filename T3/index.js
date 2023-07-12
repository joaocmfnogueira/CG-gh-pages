// import { fadeInPlano } from "./src/js/construtores.js";
import { clickListener, windowResize } from "./src/js/initialConfig.js";
import { camera, scene, renderer, construirCena } from "./src/js/scene.js";
import {
  criarAlvo,
  criarAviao,
  criarCameraHolder,
  criarPlanosIniciais,
  criarTargetObject,
  criarSkyBox,
} from "./src/js/objects.js";
import { atualizarObjetos, fadePlanos } from "./src/js/actions.js";
import { keyboardUpdate, rotacaoMouse } from "./src/js/controls.js";
import * as THREE from "three";
import {
  animacao,
  alternarAnimacao,
  atualizarVelocidade,
  velocidade,
} from "./src/js/actions.js";

export const cameraHolder = criarCameraHolder();
export const aviao = criarAviao();
export const targetObject = criarTargetObject();
export const alvo = criarAlvo();
export const skybox = criarSkyBox();


export const planos = [];
export const projeteis = [];
export const projeteisTorreta = [];
export const torretas = [];
export const valor = 0;

const canvas = document.querySelector("canvas");
canvas.style.cursor = "none";


export const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
export const sound = new THREE.Audio(listener);

TelaInicio();
windowResize();


function TelaInicio() {
  let loadingScreen = document.getElementById('loading-screen');
  loadingScreen.transition = 0;
  loadingScreen.style.setProperty('--speed1', '0');
  loadingScreen.style.setProperty('--speed2', '0');
  loadingScreen.style.setProperty('--speed3', '0');
  let button = document.getElementById("myBtn");
  button.style.backgroundColor = 'Red';
  button.innerHTML = 'Click to Enter';
  button.addEventListener("click", onButtonPressed);
}

function onButtonPressed() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.transition = 0;
  loadingScreen.classList.add('fade-out');
  loadingScreen.addEventListener('transitionend', (e) => {
    const element = e.target;
    element.remove();
  });
  let audioLoader1 = new THREE.AudioLoader();
  audioLoader1.load('../assets/sounds/sampleMusic.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play(); // Will play 
  });


  clickListener();

  construirCena();
  criarPlanosIniciais();


  render();

  function render() {
    atualizarObjetos();
    keyboardUpdate();
    rotacaoMouse();
    fadePlanos();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}
