import * as THREE from "three";

import { alvo, aviao, planos, projeteis, torretas, skybox, cameraHolder } from "../../index.js";
import { criarProjetil } from "./construtores.js";
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

  // for (let i = 0; i < projeteis.length; i++)
  //   projeteis[i].translateZ(-8 * velocidade);
}

export function atualizarProjetil() {
  for (let i = 0; i < projeteis.length; i++)
    projeteis[i].object.translateZ(-8 * velocidade);
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
  // skybox.position.z = cameraHolder.position.z;


  // projeteis.forEach((projetil) => {
  //   if (projetil.position.z <= aviao.position.z - 1000) {
  //     scene.remove(projetil);
  //     projeteis.splice(index, 1);
  //   }
  // });
  if (projeteis.length) {
    atualizarProjetil();
    // for (let j = 0; j < projeteis.length; j++) {
    //   for (let i = 0; i < torretas.length; i++) {
    //     checkCollisions(projeteis[j], torretas[i]);
    //   }
    // }
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
  
    console.log("bateu");
    torreta.object.traverse(function (node) {
      if (node.material) {
        node.material.opacity = 0;

      }
    });
  
}