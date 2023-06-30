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
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'

export const cameraHolder = criarCameraHolder();
export const aviao = criarAviao();
export const targetObject = criarTargetObject();
export const alvo = criarAlvo();
export const skybox = criarSkyBox();


export const planos = [];
export const projeteis = [];
export const torretas = [];

let mixer, audioLoader, audioPath, r2d2, time = 0;
let clock = new THREE.Clock();

const canvas = document.querySelector("canvas");
canvas.style.cursor = "none";

const loadingManager = new THREE.LoadingManager( () => {
  let loadingScreen = document.getElementById( 'loading-screen' );
  console.log(loadingScreen);
  loadingScreen.transition = 0;
  loadingScreen.style.setProperty('--speed1', '0');  
  loadingScreen.style.setProperty('--speed2', '0');  
  loadingScreen.style.setProperty('--speed3', '0');      

  let button  = document.getElementById("myBtn")
  button.style.backgroundColor = 'Red';
  button.innerHTML = 'Click to Enter';
  button.addEventListener("click", onButtonPressed);
});

windowResize();
clickListener();

construirCena();
criarPlanosIniciais();

loadAudio(loadingManager, '../assets/sounds/imperial.mp3');

render();

function render() {
  const delta = clock.getDelta();
    if ( mixer !== undefined ) mixer.update( delta );
  atualizarObjetos();
  keyboardUpdate();
  rotacaoMouse();
  // fadeInPlano(planos, cameraHolder);
  fadePlanos();
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}


function onButtonPressed() {
  const loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.transition = 0;
  loadingScreen.classList.add( 'fade-out' );
  loadingScreen.addEventListener( 'transitionend', (e) => {
    const element = e.target;
    element.remove();  
  });  
  // Config and play the loaded audio
  let sound = new THREE.Audio( new THREE.AudioListener() );
  audioLoader.load( audioPath, function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.play(); 
  });
}


function loadAudio(manager, audio)
{
  // Create ambient sound
  audioLoader = new THREE.AudioLoader(manager);
  audioPath = audio;
}