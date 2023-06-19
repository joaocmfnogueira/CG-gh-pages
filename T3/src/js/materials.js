import * as THREE from "three";

import { setDefaultMaterial } from "../../../libs/util/util.js";

export const materialTronco = criarMaterialTronco();
export const materialCopa = criarMaterialCopa();
export const materialLateralPlano = criarMaterialLateralPlano();
export const materialProjetil = criarMaterialProjetil();

function criarMaterialTronco() {
  const materialTronco = setDefaultMaterial("rgb(150,75,0)");
  materialTronco.transparent = true;
  materialTronco.opacity = 0.1;
  materialTronco.name = "tronco";
  return materialTronco;
}

function criarMaterialCopa() {
  const materialCopa = setDefaultMaterial("rgb(0,128,0)");
  materialCopa.transparent = true;
  materialCopa.opacity = 0.1;
  materialCopa.name = "copa";
  return materialCopa;
}

function criarMaterialLateralPlano() {
  const materialLateralPlano = new THREE.MeshPhongMaterial({
    color: 0x3c1e96,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  return materialLateralPlano;
}

function criarMaterialProjetil() {
  const materialProjetil = setDefaultMaterial("rgb(255,0,0)");
  return materialProjetil;
}
