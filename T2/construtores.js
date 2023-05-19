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
  createLightSphere,
} from "../libs/util/util.js";
import Grid from "../libs/util/grid.js";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../build/jsm/loaders/OBJLoader.js";
import { PLYLoader } from "../build/jsm/loaders/PLYLoader.js";
import { MTLLoader } from "../build/jsm/loaders/MTLLoader.js";

export function initLight(position, scene) {
  const ambientLight = new THREE.HemisphereLight(
    "white", // bright sky color
    "darkslategrey", // dim ground color
    0.4 // intensity
  );

  const mainLight = new THREE.DirectionalLight("white", 0.7);
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
  aviaoInteiro.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
    }
  });
  plane.add(aviaoInteiro);

  return tronco;
}

export function createTroncoMaterial() {
  let materialTronco = setDefaultMaterial("rgb(150,75,0)");
  materialTronco.transparent = true;
  materialTronco.opacity = 0.1;
  return materialTronco;
}

export function createCopaMaterial() {
  let materialCopa = setDefaultMaterial("rgb(0,128,0)");
  materialCopa.transparent = true;
  materialCopa.opacity = 0.1;
  return materialCopa;
}

export function createBala(scene, aviaoInteiro, cameraHolder, alvo) {
  let materialBala = setDefaultMaterial("rgb(255,0,0)");
  let a = 0;
  let balaGeometry = new THREE.BoxGeometry(5.0,5.0,5.0);
  let bala = new THREE.Mesh(balaGeometry, materialBala);
  let obj1 = new THREE.Vector3(alvo.position.x, alvo.position.y , alvo.position.z);
  let obj2 = new THREE.Vector3(cameraHolder.position.x, cameraHolder.position.y, cameraHolder.position.z);
  let direction = new THREE.Vector3();
  direction.subVectors(obj2, obj1).normalize();
  let quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
  bala.setRotationFromQuaternion(quaternion);

  bala.scale.set(1,1,5);
  scene.add(bala);
  bala.position.copy(aviaoInteiro.position);
 bala.position.y += 10;

  return bala;
}

export function gerarPlano(
  planos,
  scene,
  aviaoInteiro,
  materialTronco,
  materialCopa
) {
  const isNewPlane = planos.length ? true : false;
  const plano = isNewPlane ? createGroundPlaneWired(2000, 200, 15, 2) : planos;

  if (isNewPlane) {
    const planoOld = planos.shift();
    scene.remove(planoOld);
    plano.position.z = aviaoInteiro.position.z - 1000;
    planos.push(plano);
    scene.add(plano);

    const geometry = new THREE.BoxGeometry(200, 200, 200, 32, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x3c1e96,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const cube = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry, material);

    const geo = new THREE.EdgesGeometry(geometry, 1);
    const mat = new THREE.LineBasicMaterial({ color: 0x969696 });

    const wireframe = new THREE.LineSegments(geo, mat);
    const wireframe2 = new THREE.LineSegments(geo, mat);

    cube.add(wireframe);
    cube2.add(wireframe2);

    plano.add(cube);
    plano.add(cube2);

    cube.position.x = 300;
    cube.position.z = 100;

    cube2.position.x = -300;
    cube2.position.z = 100;
  }

  let quantidade = 1 + Math.floor(Math.random() * 10);
  for (let index = 0; index < quantidade; index++) {
    const tronco = createTree(plano, materialTronco, materialCopa);
  }

  if (planos.length) {
    planos.forEach((plane) => {
      plane.children.forEach((object, index) => {
        if (index !== 0) {
          object.children.forEach((mesh) => {
            if (mesh.type === "Mesh") {
              // mesh.material.opacity += 0.05;
            }
          });
          //   console.log(object);
          //   console.log(object.children[0].material.opacity);
          //   object.children[0].material.opacity += index * 0.1;
          //   children.children[0].material.opacity += index * 0.2;

          //   console.log(children);
        }
      });
      //   console.log(plane);
      //   plane.children[index + 1].children[0].material.opacity += index * 0.2;
      //   plane.children[index + 1].children[0].children[0].material.opacity = 1;
    });
  }
  loadGLBFileTorreta(plano);
}

export function loadGLBFileAviao(aviaoInteiro) {
  var loader = new GLTFLoader();
  loader.load("aviao.glb", function (gltf) {
    var obj = gltf.scene;
    obj.name = "aviao";

    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    obj.traverse(function (node) {
      if (node.material) node.material.side = THREE.DoubleSide;
    });
    //obj.rotateZ(THREE.MathUtils.degToRad(0));
    obj.rotateY(THREE.MathUtils.degToRad(180));
    aviaoInteiro.add(obj);
    obj.castShadow = true;
    obj.position.y = 5;
  });
}

function loadGLBFileTorreta(plane) {
  var loader = new GLTFLoader();
  loader.load("torreta.glb", function (gltf) {
    var obj = gltf.scene;
    obj.name = "torreta";

    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    obj.traverse(function (node) {
      if (node.material) node.material.side = THREE.DoubleSide;
    });
    //obj.rotateZ(THREE.MathUtils.degToRad(0));
    obj.rotateY(THREE.MathUtils.degToRad(0));
    plane.add(obj);
    obj.scale.set(10, 10, 10);
    obj.position.set(
      -250 + Math.random() * 500.0,
      -125 + Math.random() * 375.0,
      1.5
    );
    obj.rotateX(THREE.MathUtils.degToRad(90));
    obj.rotateY(THREE.MathUtils.degToRad(270));
    obj.castShadow = true;
  });
}

export function rayCaster(scene, camera){
// -- Create raycaster
let raycaster = new THREE.Raycaster();

// Enable layers to raycaster and camera (layer 0 is enabled by default)
raycaster.layers.enable( 0 );
camera.layers.enable( 0 );

// Create list of plane objects 
let plane, planeGeometry, planeMaterial;
   planeGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
   planeMaterial = new THREE.MeshLambertMaterial();
   planeMaterial.side = THREE.DoubleSide;
   planeMaterial.transparent = true;
   planeMaterial.opacity = 0.8;
   plane = new THREE.Mesh(planeGeometry, planeMaterial);
   plane.position.set(0,-50,-100);
   camera.add(plane);


// Object to represent the intersection point
let intersectionSphere = new THREE.Mesh(
   new THREE.SphereGeometry(10.2, 30, 30, 0, Math.PI * 2, 0, Math.PI),
   new THREE.MeshPhongMaterial({color:"orange", shininess:"200"}));
scene.add(intersectionSphere);
}

export function createAlvo(scene){
  let geometry = new THREE.CircleGeometry( 5, 32 ); 
  let material = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" } ); 
  material.transparent = true;
  material.opacity = 0.6;
  let circle = new THREE.Mesh( geometry, material ); 
  return circle;
  }

//   export function RotationLook(h, v, speed) {
//     aimTarget.parent.position.set(0, 0, 0);
//     aimTarget.localPosition.set(h, v, 1);
//     var targetRotation = new THREE.Quaternion();
//     targetRotation.setFromRotationMatrix(new THREE.Matrix4().lookAt(aimTarget.position, aimTarget.parent.position, aimTarget.up));
//     transform.quaternion.rotateTowards(targetRotation, speed * MathUtils.DEG2RAD * deltaTime);
// }