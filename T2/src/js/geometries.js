import * as THREE from "three";

export const geometriaTronco = criarGeometriaTronco();
export const geometriaCopa = criarGeometriaCopa();
export const geometriaLateralPlano = criarGeometriaLateralPlano();
export const wireframeLateralDireitaPlano = criarWireframeLateralPlano();
export const wireframeLateralEsquerdaPlano = criarWireframeLateralPlano();

function criarGeometriaTronco() {
  const geometriaTronco = new THREE.CylinderGeometry(2, 2, 15, 20);
  return geometriaTronco;
}

function criarGeometriaCopa() {
  const geometriaCopa = new THREE.ConeGeometry(5, 20, 32);
  return geometriaCopa;
}

function criarWireframeLateralPlano() {
  const geometriaWireframe = new THREE.EdgesGeometry(geometriaLateralPlano, 1);
  const materialWireframe = new THREE.LineBasicMaterial({ color: 0x969696 });
  const wireframe = new THREE.LineSegments(
    geometriaWireframe,
    materialWireframe
  );
  return wireframe;
}

function criarGeometriaLateralPlano() {
  const geometriaLateralPlano = new THREE.BoxGeometry(
    200,
    200,
    200,
    32,
    32,
    32
  );
  return geometriaLateralPlano;
}
