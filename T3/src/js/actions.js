import * as THREE from "three";

import { alvo, aviao, planos, projeteis, torretas, projeteisTorreta, skybox, cameraHolder } from "../../index.js";
import { criarProjetil, criarProjetilTorreta } from "./construtores.js";
import { alternarCursor } from "./controls.js";
// import { materialCopa, materialTronco } from "./materials.js";
import { criarPlano } from "./objects.js";
import { scene } from "./scene.js";

export let animacao = true;
export let velocidade = 2;

export function alternarAnimacao() {
  animacao = !animacao;
}

export function atualizarVelocidade(valor) {
  valor.type === Number && (velocidade = valor);
}

export function atirarProjetil() {
  const projetil = criarProjetil();
  projeteis.push(projetil);
}

export function atirarProjetilTorretas() {
  if(torretas.length){
    let aleatorio = Math.floor(Math.random() * torretas.length);
    console.log(aleatorio);
    const projetilTorreta = criarProjetilTorreta(aleatorio);
    projeteisTorreta.push(projetilTorreta);}
}

export function atualizarProjetil() {
  for (let i = 0; i < projeteis.length; i++) {
    projeteis[i].object.translateZ(-3 * velocidade);
    projeteis[i].bb.setFromObject(projeteis[i].object);
    projeteis[i].object.setRotationFromQuaternion(projeteis[i].direction);
    // console.log(projeteis[i].direction);
  }
}

export function atualizarProjetilTorreta() {
  for (let i = 0; i < projeteisTorreta.length; i++) {
    projeteisTorreta[i].object.translateZ(-3 * velocidade);
    projeteisTorreta[i].bb.setFromObject(projeteisTorreta[i].object);
    projeteisTorreta[i].object.setRotationFromQuaternion(projeteisTorreta[i].direction);
    // console.log(projeteis[i].direction);
  }
}

export function checarClique() {
  if (animacao) {
    atirarProjetil();
  } else {
    alternarAnimacao();
    atualizarVelocidade(2);
    alternarCursor();
    alvo.material.opacity = 0.6;
    alvo.getObjectByName("parte2").material.opacity = 0.6;
    alvo.getObjectByName("parte3").material.opacity = 0.6;
    alvo.getObjectByName("parte4").material.opacity = 0.6;
  }
}

export function atualizarObjetos() {
  if (aviao.position.z % 200 === 0) {
    criarPlano();
  }
  //  console.log(aviao.position.z);
  //  console.log(torretas.length);
  
  // if ((aviao.position.z % 200) && torretas.length && aviao.position.z > 400){
  //   // console.log(torretas.length);
  //   // console.log(torretas[2].object);
  //   atirarProjetilTorretas();
  // }

  // if(projeteisTorreta.length){
  //   atualizarProjetilTorreta();
  // }

  // projeteis.forEach((projetil) => {
  //   if (projetil.position.z <= aviao.position.z - 1000) {
  //     scene.remove(projetil);
  //     projeteis.splice(index, 1);
  //   }
  // });
  if (projeteis.length) {
    atualizarProjetil();
    for (let j = 0; j < projeteis.length; j++) {
      for (let i = 0; i < torretas.length; i++) {
        checkCollisions(projeteis[j], torretas[i]);
      }
    }
  }
}

export function fadePlanos() {
  for (let i = 0; i < planos.length; i++) {
    let opacidade = 1 - (planos[i].position.z - aviao.position.z) / -1000;

    planos[i].material.transparent = true;
    planos[i].material.opacity = opacidade;

    planos[i].children[0].material.transparent = true;
    planos[i].children[0].material.opacity = opacidade;
    // planos[i].traverse(function (node) {
    //   if (node.name === "lateralEsquerda" || node.name === "lateralDireita") {
    //     node.material.transparent = true;
    //     node.material.opacity = opacidade;
    //     // arrumar transparencia, logica mais complexa
    //   }
    // });
  }
}

export function checkCollisions(bala, torreta) {
  // console.log(torreta.bb);
  // console.log(bala.bb);
  let collision = torreta.bb.intersectsBox(bala.bb);
  if (collision) {
    // console.log("bateu");
    torreta.object.traverse(function (node) {
      if (node.material) {
        node.material.opacity = 0;

      }
    });
  }
}