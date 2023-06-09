import * as THREE from "three";
import { GLTFLoader } from "../../../build/jsm/loaders/GLTFLoader.js";
import { materialProjetil } from "./materials.js";
import { alvo, aviao, cameraHolder, torretas } from "../../index.js";
import { scene } from "./scene.js";

// export function criarProjetil() {
//   let assetBala = {
//     object: null,
//     loaded: false,
//     bb: new THREE.Box3(),
//     direction: null
//  }

//   let balaGeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0);
//   let bala = new THREE.Mesh(balaGeometry, materialProjetil);
//   let obj1 = new THREE.Vector3(
//     alvo.position.x,
//     alvo.position.y,
//     alvo.position.z - 20
//   );
//   let obj2 = new THREE.Vector3(
//     aviao.position.x,
//     aviao.position.y,
//     aviao.position.z
//   );
//   let direction = new THREE.Vector3();
//   direction.subVectors(obj2, obj1).normalize();
//   let quaternion = new THREE.Quaternion();
//   quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
//   bala.setRotationFromQuaternion(quaternion);

//   bala.scale.set(1, 1, 5);
//   let bbbala = new THREE.Box3().setFromObject(bala);
//   assetBala.bb = bbbala;
//   assetBala.object = bala;

//   scene.add(assetBala.object);
//   assetBala.object.position.copy(aviao.position);
//   assetBala.object.position.y += 10;
//   let helper = new THREE.Box3Helper( bbbala, "yellow" );
//   scene.add( helper );
//   assetBala.direction = quaternion;

//   // scene.add(bbbala);

//   return assetBala;
// }

export function criarProjetil() {
  let assetBala = {
    object: null,
    loaded: false,
    bb: new THREE.Box3(),
    // direction: null,
  };

  let balaGeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0);
  let bala = new THREE.Mesh(balaGeometry, materialProjetil);

  // Calculate direction vector between plane and target
  let direction = new THREE.Vector3();
  direction.subVectors(alvo.position, aviao.position).normalize();

  // Set rotation of projectile to face direction
  let quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
  bala.setRotationFromQuaternion(quaternion);

  bala.scale.set(1, 1, 5);
  let bbbala = new THREE.Box3().setFromObject(bala);
  assetBala.bb = bbbala;
  assetBala.object = bala;

  scene.add(assetBala.object);
  assetBala.object.position.copy(aviao.position);
  assetBala.object.position.y += 10;
  let helper = new THREE.Box3Helper(bbbala, "yellow");
  scene.add(helper);
  // assetBala.direction = quaternion;

  return assetBala;
}

export function criarProjetilTorreta(indice) {
  let assetBala = {
    object: null,
    loaded: false,
    bb: new THREE.Box3(),
    direction: null
 }

  let balaGeometry = new THREE.BoxGeometry(5.0, 5.0, 5.0);
  let bala = new THREE.Mesh(balaGeometry, materialProjetil);
  let obj1 = new THREE.Vector3(
    aviao.position.x,
    aviao.position.y,
    aviao.position.z - 20
  );
  let obj2 = new THREE.Vector3(
    torretas[indice].object.position.x,
    torretas[indice].object.position.y,
    torretas[indice].object.position.z
  );
  let direction = new THREE.Vector3();
  direction.subVectors(obj2, obj1).normalize();
  let quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
  bala.setRotationFromQuaternion(quaternion);

  bala.scale.set(1, 1, 5);
  let bbbala = new THREE.Box3().setFromObject(bala);
  assetBala.bb = bbbala;
  assetBala.object = bala;
  
  scene.add(assetBala.object);
  assetBala.object.position.copy(aviao.position);
  assetBala.object.position.y += 10;
  let helper = new THREE.Box3Helper( bbbala, "yellow" );
  scene.add( helper );
  assetBala.direction = quaternion;
  
  // scene.add(bbbala);
    
  return assetBala;
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

// export function createSphere(plane)
// {
//   let geometry = new THREE.SphereGeometry(10, 30, 30, 0, Math.PI * 2, 0, Math.PI);
//   let objectMaterial

//   objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,20,20)", shininess:"200"});

//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     plane.add(object);
//   return object;
// }

export function createAlvo() {
  let targetShape = new THREE.Shape();
  targetShape.moveTo(0, 0);
  targetShape.lineTo(1, 0);
  targetShape.lineTo(1, 7);
  targetShape.lineTo(0, 7);

  let targetShape2 = new THREE.Shape();
  targetShape2.moveTo(0, 0);
  targetShape2.lineTo(7, 0);
  targetShape2.lineTo(7, 1);
  targetShape2.lineTo(0, 1);

  let mira = aux_create_mira(targetShape);

  let mira2 = aux_create_mira(targetShape2);
  mira2.name = "parte2";

  let mira3 = aux_create_mira(targetShape);
  mira3.name = "parte3";

  let mira4 = aux_create_mira(targetShape2);
  mira4.name = "parte4";

  mira.add(mira2);
  mira.add(mira3);
  mira.add(mira4);
  mira2.position.set(1, -1, 0);
  mira3.position.set(8, 0, 0);
  mira4.position.set(1, 7, 0);

  return mira;
}

function aux_create_mira(targetShape) {
  const geometry = new THREE.ShapeGeometry(targetShape);
  let material = new THREE.MeshBasicMaterial({ color: "rgb(0,255,0)" });
  material.transparent = true;
  material.opacity = 0.6;
  let mira = new THREE.Mesh(geometry, material);
  return mira;
}

export function loadGLBFileTorreta(plane) {
  var loader = new GLTFLoader();
  let assetTorreta = {
    object: null,
    loaded: false,
    bb: new THREE.Box3(),
  };
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
    obj = fixPosition(obj);
    obj.updateMatrixWorld(true);
    assetTorreta.bb = bbtorreta;
    assetTorreta.object = gltf.scene;
    let helper = new THREE.Box3Helper(bbtorreta, "yellow");
    scene.add(helper);
    helper.position.z = assetTorreta.object.position.z;
    helper.position.y = assetTorreta.object.position.y;
    helper.position.x = assetTorreta.object.position.x;

    // console.log(assetTorreta.object.position)
    // console.log(helper.position);
  });
  return assetTorreta;
}

function fixPosition(obj) {
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject(obj);
  if (box.min.y > 0) obj.translateY(-box.min.y);
  else obj.translateY(-1 * box.min.y);
  return obj;
}

export function createBBHelper(bb, color, plane) {
  // Create a bounding box helper
  let helper = new THREE.Box3Helper(bb, color);
  plane.add(helper);
  return helper;
}
