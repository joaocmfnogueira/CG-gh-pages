import * as THREE from "three";

import { alvo, aviao, projeteis } from "../../index.js";
import { criarProjetil } from "./construtores.js";
import { alternarCursor } from "./controls.js";
import { materialCopa, materialTronco } from "./materials.js";
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

  for (let i = 0; i < projeteis.length; i++)
    projeteis[i].translateZ(-8 * velocidade);
}

export function checarClique() {
  if (animacao) {
    atirarProjetil();
  } else {
    alternarAnimacao();
    atualizarVelocidade(2);
    alternarCursor();
    alvo.material.opacity = 0.6;
  }
}

export function atualizarObjetos() {
  materialTronco.opacity = 0.5;
  materialCopa.opacity = 0.5;

  if (aviao.position.z % 200 === 0) {
    criarPlano();
  }

  projeteis.forEach((projetil) => {
    if (projetil.position.z <= aviao.position.z - 1000) {
      scene.remove(projetil);
      projeteis.splice(index, 1);
    }
  });
}
