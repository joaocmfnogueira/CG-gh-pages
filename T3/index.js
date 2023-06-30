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

export const cameraHolder = criarCameraHolder();
export const aviao = criarAviao();
export const targetObject = criarTargetObject();
export const alvo = criarAlvo();
export const skybox = criarSkyBox();


export const planos = [];
export const projeteis = [];
export const torretas = [];


const canvas = document.querySelector("canvas");
canvas.style.cursor = "none";

windowResize();
clickListener();

construirCena();
criarPlanosIniciais();

render();

function render() {
  atualizarObjetos();
  keyboardUpdate();
  rotacaoMouse();
  // fadeInPlano(planos, cameraHolder);
  fadePlanos();
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}
