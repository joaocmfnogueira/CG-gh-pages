import * as THREE from "three";

import { setDefaultMaterial } from "../../../libs/util/util.js";

export const materialLateralPlano = criarMaterialLateralPlano();
export const materialProjetil = criarMaterialProjetil();

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
