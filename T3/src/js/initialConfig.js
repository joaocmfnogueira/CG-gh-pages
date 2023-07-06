import * as THREE from "three";
import { alvo, planos } from "../../index.js";
import { camera, raycaster, renderer } from "./scene.js";
import { checarClique } from "./actions.js";
import { onWindowResize } from "../../../libs/util/util.js";

export const windowHalfX = window.innerWidth / 2;
export const windowHalfY = window.innerHeight / 2;

export let mouseX = 0;
export let mouseY = 0;

export function windowResize() {
  document.addEventListener("mousemove", onDocumentMouseMove);
  window.addEventListener(
    "resize",
    () => {
      onWindowResize(camera, renderer);
    },
    false
  );
  window.addEventListener("mousemove", onMouseMove);
}

export function clickListener() {
  document.addEventListener("click", () => {
    checarClique();
  });
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onMouseMove(event) {
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(alvo);

  // -- Find the selected objects ------------------------------
}

document.addEventListener("mousemove", (event) => {
  // Calculate normalized device coordinates (NDC) from mouse position
  let mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  raycaster.far = 800;

  let intersects = [];
  for (let i = 0; i < planos.length; i++) {
    let plane = planos[i];
    let planeIntersects = raycaster.intersectObject(plane, true);
    intersects.push(...planeIntersects);
  }
  if (intersects.length > 0) {
    alvo.position.copy(intersects[0].point);
  }
});
