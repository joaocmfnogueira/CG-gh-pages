import KeyboardState from "../../../libs/util/KeyboardState.js";
import { alvo, aviao, cameraHolder, targetObject, sound } from "../../index.js";
import {
  animacao,
  alternarAnimacao,
  atualizarVelocidade,
  velocidade,
} from "./actions.js";
import { mouseX, mouseY } from "./initialConfig.js";
import { camera, light } from "./scene.js";
import * as THREE from "three";

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
    alvo.getObjectByName("parte2").material.opacity = 0;
    alvo.getObjectByName("parte3").material.opacity = 0;
    alvo.getObjectByName("parte4").material.opacity = 0;
  }


  if (keyboard.up("S") && !sound.isPlaying) {
    // console.log("AAAAAA");
    sound.play()
  }
  else if(keyboard.up("S") && sound.isPlaying){
    // console.log("BBBBBBBB");
    sound.stop();
  }
}

// export function rotacaoMouse() {
//   if (animacao) {
//     targetX = mouseX * -0.003;
//     targetY = mouseY * -0.003;
//     alvo.position.x = 0.5 * mouseX;
//     alvo.position.y = 0.5 * -mouseY;

//     // Calculate direction vector between plane and target
//     let direction = new THREE.Vector3();
//     direction.subVectors(alvo.position, aviao.position).normalize();

//     // Calculate rotation quaternion from direction vector
//     let quaternion = new THREE.Quaternion();
//     quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

//     // Smoothly interpolate rotation of plane towards target
//     aviao.quaternion.slerp(quaternion, 0.1);

//     aviao.position.x = Math.sin(Date.now() * 0.001) * 50;
//     aviao.position.y = 0.1 * 1;
//     aviao.position.z -= velocidade;

//     aviao.position.x += targetX * 10;
//     aviao.position.y += targetY * 10;

//     aviao.rotation.z = 0; //!!!
//     cameraHolder.position.z -= velocidade;
//     targetObject.position.z -= velocidade;
//     light.position.z -= velocidade;
//     alvo.position.z -= velocidade;
//   }
// }

let targetPosition = new THREE.Vector3();
let targetQuaternion = new THREE.Quaternion();

export function rotacaoMouse() {
  if (animacao) {
    targetX = mouseX * -0.003;
    targetY = mouseY * -0.003;

    aviao.position.z -= velocidade;

    alvo.position.x = 0.5 * mouseX;
    alvo.position.y = 0.5 * -mouseY;

    targetPosition.x = -targetX * 80;
    targetPosition.y = targetY * 80;

    let direction = new THREE.Vector3();
    direction.subVectors(targetPosition, aviao.position).normalize();

    targetQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

    

    

    aviao.lookAt(
      new THREE.Vector3(
        targetPosition.x,
        targetPosition.y,
        aviao.position.z + 150
      )
    );

    aviao.rotation.x = targetY * Math.PI * 0.1;
    aviao.rotation.y = targetX * Math.PI * 0.1;

    aviao.quaternion.slerp(targetQuaternion, 0.1);

    aviao.position.lerp(
      new THREE.Vector3(targetPosition.x, targetPosition.y, aviao.position.z),
      0.08
    );

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
