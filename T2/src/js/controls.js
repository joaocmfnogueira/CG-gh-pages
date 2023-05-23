import KeyboardState from "../../../libs/util/KeyboardState.js";
import { alvo, aviao, cameraHolder, targetObject } from "../../index.js";
import {
  animacao,
  alternarAnimacao,
  atualizarVelocidade,
  velocidade,
} from "./actions.js";
import { mouseX, mouseY } from "./initialConfig.js";
import { light } from "./scene.js";

export const keyboard = new KeyboardState();
export let targetX = 0;
export let targetY = 0;

export function keyboardUpdate() {
  keyboard.update();

  keyboard.down("1") && atualizarVelocidade(2);
  keyboard.down("2") && atualizarVelocidade(4);
  keyboard.down("3") && atualizarVelocidade(6);

  if (keyboard.pressed("esc") && animacao) {
    alternarAnimacao();
    atualizarVelocidade(0);
    alternarCursor();
    alvo.material.opacity = 0;
  }
}

export function rotacaoMouse() {
  if (animacao) {
    targetX = mouseX * -0.003;
    targetY = mouseY * -0.003;
    alvo.position.x = 0.5 * mouseX;
    alvo.position.y = 0.5 * -mouseY;

    aviao.position.x = 0.1 * mouseX;
    aviao.position.y = -0.1 * mouseY;
    aviao.position.z -= velocidade;

    aviao.rotation.z = targetX * 0.75; //!!!
    cameraHolder.position.z -= velocidade;
    targetObject.position.z -= velocidade;
    light.position.z -= velocidade;
    alvo.position.z -= velocidade;
  }
}

export function alternarCursor() {
  const canvas = document.querySelector("canvas");

  canvas.style.cursor === "pointer"
    ? (canvas.style.cursor = "none")
    : (canvas.style.cursor = "pointer");
}
