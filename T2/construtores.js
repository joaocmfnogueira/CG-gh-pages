import * as THREE from "three";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneWired,
    getMaxSize,
    createLightSphere
} from "../libs/util/util.js";
import Grid from "../libs/util/grid.js";
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../build/jsm/loaders/OBJLoader.js';
import { PLYLoader } from '../build/jsm/loaders/PLYLoader.js';
import { MTLLoader } from '../build/jsm/loaders/MTLLoader.js';

export function initLight(position, scene) {
    const ambientLight = new THREE.HemisphereLight(
        'white', // bright sky color
        'darkslategrey', // dim ground color
        0.4, // intensity
    );

    const mainLight = new THREE.DirectionalLight('white', 0.7);
    mainLight.position.copy(position);
    mainLight.castShadow = true;

    const shadow = mainLight.shadow;
    shadow.mapSize.width = 1024;
    shadow.mapSize.height = 1024;
    shadow.camera.near = 0.1;
    shadow.camera.far = 2500;
    shadow.camera.left = -240.0;
    shadow.camera.right = 240.0;
    shadow.camera.bottom = -240.0;
    shadow.camera.top = 240.0;

    scene.add(ambientLight);
    // scene.add(mainLight);

    return mainLight;
}

export function createTree(plane, materialTronco, materialCopa) {
    // Tronco da árvore
    let aviaoInteiro = new THREE.Object3D();
    let troncoGeometry = new THREE.CylinderGeometry(2, 2, 15, 20);
    let tronco = new THREE.Mesh(troncoGeometry, materialTronco);
    tronco.position.set(
        -250 + Math.random() * 500.0,
        -125 + Math.random() * 375.0,
        7.5
    );
    aviaoInteiro.add(tronco);
    // Copa da árovore
    let arvoreGeometry = new THREE.ConeGeometry(5, 20, 32);
    let arvore = new THREE.Mesh(arvoreGeometry, materialCopa);
    arvore.position.set(0.0, 7.5, 0);
    tronco.add(arvore);
    tronco.rotateX(THREE.MathUtils.degToRad(90));
    aviaoInteiro.traverse( o => {
        if(o.isMesh){
          o.castShadow = true;
        }
      })
    plane.add(aviaoInteiro);
}

export function createTroncoMaterial(){
    let materialTronco = setDefaultMaterial("rgb(150,75,0)");
    materialTronco.transparent = true;
    materialTronco.opacity = 0.1;
    return materialTronco;
}

export function createCopaMaterial(){
    let materialCopa = setDefaultMaterial("rgb(0,128,0)");
    materialCopa.transparent = true;
    materialCopa.opacity = 0.1;
    return materialCopa;
}

export function gerarPlano(plane, scene, aviaoInteiro, materialTronco, materialCopa) {
    // Geração de planos ímpares
    let planeGrid = new Grid(2000, 1000, 10, 10, "#969696", 3);
    plane.clear();
    plane.add(planeGrid);
    plane.position.z = aviaoInteiro.position.z - 750;
    scene.add(plane);
  
    let quantidade = 1 + Math.floor(Math.random() * 10);
    for (let index = 0; index < quantidade; index++) {
      // Geração de árvores dos planos
      createTree(plane, materialTronco, materialCopa);
    }
    loadGLBFileTorreta(plane);
  }

 export function loadGLBFileAviao(aviaoInteiro)
{
   var loader = new GLTFLoader( );
   loader.load('aviao.glb', function ( gltf ) {
      var obj = gltf.scene;
      obj.name = 'aviao';

      obj.traverse( function ( child ) {
         if ( child ) {
            child.castShadow = true;
         }
      });
      obj.traverse( function( node )
      {
         if( node.material ) node.material.side = THREE.DoubleSide;
      });
       //obj.rotateZ(THREE.MathUtils.degToRad(0));
       obj.rotateY(THREE.MathUtils.degToRad(180));
      aviaoInteiro.add ( obj ); 
      obj.castShadow = true;       
      obj.position.y = 5;
    });
}

function loadGLBFileTorreta(plane)
{
   var loader = new GLTFLoader( );
   loader.load('torreta.glb', function ( gltf ) {
      var obj = gltf.scene;
      obj.name = 'torreta';

      obj.traverse( function ( child ) {
         if ( child ) {
            child.castShadow = true;
         }
      });
      obj.traverse( function( node )
      {
         if( node.material ) node.material.side = THREE.DoubleSide;
      });
       //obj.rotateZ(THREE.MathUtils.degToRad(0));
       obj.rotateY(THREE.MathUtils.degToRad(0));
       plane.add ( obj );        
       obj.scale.set(10,10,10); 
       obj.position.set(-250 + Math.random() * 500.0,
       -125 + Math.random() * 375.0,
       1.5)
       obj.rotateX(THREE.MathUtils.degToRad(90));
       obj.rotateY(THREE.MathUtils.degToRad(270));
       obj.castShadow = true;
    });
}




