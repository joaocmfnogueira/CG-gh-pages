// import { fadeInPlano } from "./src/js/construtores.js";
import { clickListener, windowResize } from "./src/js/initialConfig.js";
import { camera, scene, renderer, construirCena } from "./src/js/scene.js";
import {
  criarAlvo,
  criarAviao,
  criarCameraHolder,
  criarPlanosIniciais,
  criarTargetObject,
} from "./src/js/objects.js";
import { atualizarObjetos, fadePlanos } from "./src/js/actions.js";
import { keyboardUpdate, rotacaoMouse } from "./src/js/controls.js";

export const cameraHolder = criarCameraHolder();
export const aviao = criarAviao();
export const targetObject = criarTargetObject();
export const alvo = criarAlvo();

export const planos = [];
export const projeteis = [];

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
