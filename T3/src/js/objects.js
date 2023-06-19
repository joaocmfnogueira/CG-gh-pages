import * as THREE from "three";
import {
  createAlvo,
  loadGLBFileAviao,
  loadGLBFileTorreta,
} from "./construtores.js";
import { light, scene } from "./scene.js";
import { aviao, planos } from "../../index.js";
import { createGroundPlaneWired } from "../../../libs/util/util.js";
import { materialLateralPlano } from "./materials.js";
import {
  geometriaLateralPlano,
  wireframeLateralDireitaPlano,
  wireframeLateralEsquerdaPlano,
} from "./geometries.js";
import { targetX, targetY } from "./controls.js";

export function criarCameraHolder() {
  const cameraHolder = new THREE.Object3D();
  cameraHolder.rotateX(THREE.MathUtils.degToRad(45));
  cameraHolder.position.set(0, 20, 30);
  return cameraHolder;
}

export function criarAviao() {
  const aviao = new THREE.Object3D();
  loadGLBFileAviao(aviao);
  aviao.position.set(0, 60, 0);
  aviao.scale.set(2, 2, 2);
  aviao.rotateZ(THREE.MathUtils.degToRad(180));
  aviao.castShadow = true;
  return aviao;
}

export function criarAlvo() {
  const alvo = createAlvo(scene);
  alvo.position.set(0, 10, -50);
  alvo.renderOrder = 999;
  alvo.material.depthTest = false;
  return alvo;
}

// export function criarArvoresAleatorias(plano) {
//   let quantidade = 1 + Math.floor(Math.random() * 10);
//   for (let index = 0; index < quantidade; index++) {
//     criarArvore(plano);
//   }
// }

export function criarPlanosIniciais() {
  const inicial = true;
  for (let i = 0; i < 6; i++) {
    const distancia = i * 200;
    criarPlano(inicial, distancia);
  }
}

export function criarTargetObject() {
  const targetObject = new THREE.Object3D();
  light.target = targetObject;
  return targetObject;
}

export function criarPlano(inicial = false, distancia) {
  const plano = createGroundPlaneWired(2000, 200, 15, 2);
  plano.material.color = new THREE.Color("rgb(0, 0, 43)");
  plano.name = "plano";

  if (inicial) {
    plano.position.z = aviao.position.z - distancia;
  } else {
    plano.position.z = aviao.position.z - 1000;
    const planoAntigo = planos.shift();
    scene.remove(planoAntigo);
  }

  // criarArvoresAleatorias(plano);
  criarLateraisPlano(plano);
  loadGLBFileTorreta(plano);

  planos.push(plano);
  scene.add(plano);
}

export function criarLateraisPlano(plano) {
  const lateralEsquerda = new THREE.Mesh(
    geometriaLateralPlano,
    materialLateralPlano
  );
  lateralEsquerda.add(wireframeLateralEsquerdaPlano);
  lateralEsquerda.name = "lateralEsquerda";
  lateralEsquerda.position.x = -300;
  lateralEsquerda.position.z = 100;

  const lateralDireita = new THREE.Mesh(
    geometriaLateralPlano,
    materialLateralPlano
  );
  lateralDireita.add(wireframeLateralDireitaPlano);
  lateralDireita.name = "lateralDireita";
  lateralDireita.position.x = 300;
  lateralDireita.position.z = 100;

  plano.add(lateralEsquerda);
  plano.add(lateralDireita);
}
