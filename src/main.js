import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Material } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { GUI } from "dat.gui";

//loading starts here
const textureLoader = new THREE.TextureLoader();
// const luminosityPass = new ShaderPass( LuminosityShader );
// composer.addPass( luminosityPass );

//debugger here
const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Creating the scene
 * -- To be able to display anything with three.js,
 * -- we need three things: Scene, Camera, Renderer
 * -- so that we can render the scene with camera
 */

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  2,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

/**
 * Adding Objects and its materal property
 */
//   const boxWidth = 4
//   const boxHeight = 4
//   const boxDepth = 1

//  const geometry = new THREE.BoxGeometry(boxWidth,boxHeight, boxDepth);
//  const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } );
//  const cube = new THREE.Mesh( geometry, material );
//  scene.add( cube );
//  cube.position.y = 5

// camera.position.set(5,5,3)
// camera.lookAt(24,45,0)

const color = 0xffffff;
const intensity = 3;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

const objects = [];
const radius = 1;
const widthSegments = 10;
const heightSegents = 10;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegents,
);
// we made an Object3D. Like a Mesh it is also a node in the scene graph but unlike a Mesh it has no material or geometry. It just represents a local space.
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

//Earth
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
});
const eartMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(eartMesh);
objects.push(eartMesh);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
moonOrbit.position.y = 1;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

const updateSphere = (event) => {
  earthOrbit.position.y = window.scrollY * 0.001;
};

window.addEventListener("scroll", updateSphere);

document.addEventListener("mousemove", onDocumentMouseMove);
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0,5,0)
// controls.update()

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.0001;
  // cube.rotation.y += 0.0001;
  cube.rotation.z += -0.5;
}
// animate()
const clock = new THREE.Clock();

function renders(time) {
  targetX = mouseX * 0.0005;
  targetY = mouseY * 0.0005;
  time *= 0.0003; // convert time to seconds
  const elapsedTime = clock.getElapsedTime();
  objects.forEach((obj) => {
    obj.rotation.y = 0.1 * elapsedTime;
    obj.rotation.y += 0.3 * (targetX - obj.rotation.y);
    obj.rotation.x += 0.08 * (targetY - obj.rotation.x);
    obj.position.z += -0.02 * (targetY - obj.rotation.x);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(renders);
}
requestAnimationFrame(renders);
