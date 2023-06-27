import * as THREE from "three";
import { GLTFLoader } from "../../../build/jsm/loaders/GLTFLoader.js";
import { materialProjetil } from "./materials.js";
import { alvo, aviao, cameraHolder } from "../../index.js";
import { scene } from "./scene.js";

// export function criarArvore(plano) {
//   const copa = new THREE.Mesh(geometriaCopa, materialCopa);
//   copa.rotateX(THREE.MathUtils.degToRad(90));
//   copa.position.set(0, 0, 10);

//   const tronco = new THREE.Mesh(geometriaTronco, materialTronco);
//   tronco.rotateX(THREE.MathUtils.degToRad(90));

//   const arvore = new THREE.Object3D();
//   arvore.name = "arvore";
//   arvore.position.set(
//     -250 + Math.random() * 500.0,
//     -125 + Math.random() * 375.0,
//     7.5
//   );

//   arvore.add(copa);
//   arvore.add(tronco);
//   plano.add(arvore);

//   arvore.traverse((o) => {
//     if (o.isMesh) {
//       o.castShadow = true;
//     }
//   });

//   return arvore;
// }

export function criarProjetil() {
  let balaGeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0);
  let bala = new THREE.Mesh(balaGeometry, materialProjetil);
  let obj1 = new THREE.Vector3(
    alvo.position.x,
    alvo.position.y,
    alvo.position.z
  );
  let obj2 = new THREE.Vector3(
    aviao.position.x,
    aviao.position.y,
    aviao.position.z
  );
  let direction = new THREE.Vector3();
  direction.subVectors(obj2, obj1).normalize();
  let quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
  bala.setRotationFromQuaternion(quaternion);

  bala.scale.set(1, 1, 5);
  scene.add(bala);
  bala.position.copy(aviao.position);
  bala.position.y += 10;
  // let bbbala = new THREE.Box3().setFromObject(bala);
  // scene.add(bbbala);

  return bala;
}

export function loadGLBFileAviao() {
  var loader = new GLTFLoader();
  loader.load("src/assets/aviao.glb", function (gltf) {
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
    obj.rotateY(THREE.MathUtils.degToRad(180));
    aviao.add(obj);
    obj.castShadow = true;
    obj.position.y = 5;
  });
}

// export function fadeInPlano(planos) {
//   planos.forEach((plano) => {
//     plano.material.color.b += 0.0015;

//     // plano.children.forEach((object) => {
//     //   if (object.name === "cubo") {
//     //     object.material.color.b += 0.001;
//     //   } else if (object.name === "arvore") {
//     //     object.children.forEach((mesh) => {
//     //       mesh.material.opacity += 0.0;
//     //     });
//     //   }
//     // });
//   });
// }

export function loadGLBFileTorreta(plane) {
  var loader = new GLTFLoader();
  loader.load("src/assets/torreta.glb", function (gltf) {
    var obj = gltf.scene;
    obj.name = "torreta";

    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    obj.traverse(function (node) {
      if (node.material) {
        node.material.side = THREE.DoubleSide;
        node.material.transparent = true;
        node.material.opacity = 1;
      }
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
    let bbtorreta = new THREE.Box3().setFromObject(obj);
    let bbhelper2 = new THREE.Box3Helper(bbtorreta, "yellow");

    // plane.add(bbtorreta);
    // plane.add(bbhelper2);
    // let bbhelper = createBBHelper(bbobj, "white");
  });
}

export function rayCaster(scene, camera) {
  // -- Create raycaster
  let raycaster = new THREE.Raycaster();

  // Enable layers to raycaster and camera (layer 0 is enabled by default)
  raycaster.layers.enable(0);
  camera.layers.enable(0);

  // Create list of plane objects
  let plane, planeGeometry, planeMaterial;
  planeGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
  planeMaterial = new THREE.MeshLambertMaterial();
  planeMaterial.side = THREE.DoubleSide;
  planeMaterial.transparent = true;
  planeMaterial.opacity = 0.8;
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -50, -100);
  camera.add(plane);

  // Object to represent the intersection point
  let intersectionSphere = new THREE.Mesh(
    new THREE.SphereGeometry(10.2, 30, 30, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshPhongMaterial({ color: "orange", shininess: "200" })
  );
  scene.add(intersectionSphere);
}

export function createAlvo(scene) {
  // let geometry = new THREE.CircleGeometry(5, 32);
  // let material = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  // material.transparent = true;
  // material.opacity = 0.6;
  // let circle = new THREE.Mesh(geometry, material);

  let targetShape = new THREE.Shape();

  targetShape.moveTo( 0,0 );
  targetShape.lineTo( 1, 0 );
  targetShape.lineTo( 1, 7 );
  targetShape.lineTo( 0, 7 );

  let targetShape2 = new THREE.Shape();

  targetShape2.moveTo( 0,0 );
  targetShape2.lineTo( 7, 0 );
  targetShape2.lineTo( 7, 1 );
  targetShape2.lineTo( 0, 1 );

  // const geometry = new THREE.ShapeGeometry( targetShape );
  // let material = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  // material.transparent = true;
  // material.opacity = 0.6;
  let mira = aux_create_mira(targetShape);

  // const geometry2 = new THREE.ShapeGeometry( targetShape2 );
  // let material2 = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  // material2.transparent = true;
  // material2.opacity = 0.6;
  let mira2 = aux_create_mira(targetShape2);
  mira2.name = "parte2";

  // const geometry3 = new THREE.ShapeGeometry( targetShape );
  // let material3 = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  // material3.transparent = true;
  // material3.opacity = 0.6;
  let mira3 = aux_create_mira(targetShape);
  mira3.name = "parte3";

  // const geometry4 = new THREE.ShapeGeometry( targetShape2 );
  // let material4 = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  // material4.transparent = true;
  // material4.opacity = 0.6;
  let mira4 = aux_create_mira(targetShape2);
  mira4.name = "parte4";

  mira.add(mira2);
  mira.add(mira3);
  mira.add(mira4);

  mira2.position.set(1,-1,0);
  mira3.position.set(8,0,0);
  mira4.position.set(1,7,0);

  return mira;
}

function aux_create_mira(targetShape){
  const geometry = new THREE.ShapeGeometry(targetShape);
  let material = new THREE.MeshBasicMaterial({ color: "rgb(0,255,0)" });
  material.transparent = true;
  material.opacity = 0.6;
  let mira = new THREE.Mesh(geometry, material);
  return mira;
}

function checkCollisions(bala, torreta) {
  let collision = torreta.intersectsBox(bala);
  if (collision) {
    torreta.traverse(function (node) {
      if (node.material) {
        node.material.opacity = 0;
      }
    });
  }
}

export function createBBHelper(bb, color)
{
   // Create a bounding box helper
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}