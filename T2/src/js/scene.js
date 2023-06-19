import * as THREE from "three";
import { initRenderer, initCamera } from "../../../libs/util/util.js";
import { alvo, aviao, cameraHolder, targetObject } from "../../index.js";

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

export const camera = initCamera(new THREE.Vector3(0, 50, 40));
camera.layers.enable(0);

export const raycaster = new THREE.Raycaster();
raycaster.layers.enable(0);

export const renderer = initRenderer();

export const light = initLight(new THREE.Vector3(375, 750, -900), scene);

export function construirCena() {
  scene.add(light);
  scene.add(cameraHolder);
  scene.add(targetObject);
  scene.add(aviao);
  scene.add(alvo);

  cameraHolder.add(camera);
}

export function initLight(position, scene) {
  const ambientLight = new THREE.HemisphereLight("white", "darkslategrey", 0.4);

  const mainLight = new THREE.DirectionalLight("white", 0.7);
  mainLight.position.copy(position);
  mainLight.castShadow = true;

  const shadow = mainLight.shadow;
  shadow.mapSize.width = 2048;
  shadow.mapSize.height = 2048;
  shadow.camera.near = 0.1;
  shadow.camera.far = 2000;
  shadow.camera.left = -240.0;
  shadow.camera.right = 240.0;
  shadow.camera.bottom = -240.0;
  shadow.camera.top = 240.0;

  scene.add(ambientLight);

  return mainLight;
}
