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

export const cameraHolder = criarCameraHolder();
export const aviao = criarAviao();
export const targetObject = criarTargetObject();
export const alvo = criarAlvo();
export const skybox = criarSkyBox();


export const planos = [];
export const projeteis = [];
export const projeteisTorreta = [];
export const torretas = [];

// let pressed = false;

let mixer, audioLoader, audioPath, time = 0;
let clock = new THREE.Clock();

const canvas = document.querySelector("canvas");
canvas.style.cursor = "none";


// loadAudio('../assets/sounds/imperial.mp3');
TelaInicio();
windowResize();
clickListener();

construirCena();
criarPlanosIniciais();


render();

function render() {
  // const delta = clock.getDelta();
  //   if ( mixer !== undefined ) mixer.update( delta );

  atualizarObjetos();
  keyboardUpdate();
  rotacaoMouse();
  // fadeInPlano(planos, cameraHolder);
  fadePlanos();
  requestAnimationFrame(render);

  renderer.render(scene, camera);
  // }

  
}

function TelaInicio(){
  // let loadingScreen = document.getElementById( 'loading-screen' );
  // // loadingScreen.transition = 0;
  // // loadingScreen.style.setProperty('--speed1', '0');  
  // // loadingScreen.style.setProperty('--speed2', '0');  
  // // loadingScreen.style.setProperty('--speed3', '0');      
  console.log("aaa");
  let button  = document.getElementById("myBtn");
  button.style.backgroundColor = 'Red';
  button.innerHTML = 'Click to Enter';
  button.addEventListener("click", onButtonPressed);
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
  // let sound = new THREE.Audio( new THREE.AudioListener() );
  // audioLoader.load( audioPath, function( buffer ) {
  //   sound.setBuffer( buffer );
  //   sound.setLoop( true );
  //   sound.play(); 
  // });
}

// function loadAudio(audio)
// {
//   // Create ambient sound
//   // audioLoader = new THREE.AudioLoader(manager);
//   audioPath = audio;
// }