import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf5f5f5 );
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setAnimationLoop( animate );

document.body.appendChild(renderer.domElement);

// Geometrie für einen 20-seitigen Würfel (Ikosaeder)
const geometry = new THREE.IcosahedronGeometry(1);

// Definiere vier Farben
const colorOptions = [
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0xa5bc43),  // Grün
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0xa5bc43),  // Grün
    new THREE.Color(0xeee46a),  // Gelb 
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0xa5bc43),  // Grün
    new THREE.Color(0xa5bc43),  // Grün
    new THREE.Color(0x75bcd1),  // Blau
    new THREE.Color(0xeee46a),  // Gelb 
    new THREE.Color(0xa5bc43),  // Grün
    new THREE.Color(0xeee46a),  // Gelb 
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0x75bcd1),  // Blau
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0xeee46a),  // Gelb 
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0xeee46a),  // Gelb 
    new THREE.Color(0xd33d2e),  // Rot
    new THREE.Color(0x75bcd1),  // Blau      
];

// Erstellen eines neuen Arrays für die Farben, das zu den Vertices passt
const colors = [];

// Füge Farben abwechselnd hinzu (für jedes Dreieck im Ikosaeder)
for (let i = 0; i < geometry.attributes.position.count / 3; i++) {
    const color = colorOptions[i];  // Abwechselnde Farben
    // Jedes Dreieck hat drei Vertices, die die gleiche Farbe bekommen
    for (let j = 0; j < 3; j++) {
        colors.push(color.r, color.g, color.b);
    }
}

// Füge das Farb-Array der Geometrie hinzu
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Material, das die Farben verwendet, die in der Geometrie definiert wurden
const material = new THREE.MeshBasicMaterial({ vertexColors: true });

// Erstelle den 20-seitigen Würfel (Ikosaeder)
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.scale.set(1.3,1.3,1.3)        // Startgröße anpassen
icosahedron.rotation.set(0.4,5,0)   // Startausrichtung anpassen
scene.add(icosahedron);

camera.position.z = 5;

// OrbitControls zur Interaktion mit dem Objekt
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional für sanftere Kamerabewegung
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;
controls.maxPolarAngle = 10* Math.PI;
controls.minPolarAngle = -10* Math.PI;

controls.enableZoom = false;

function animate() {
    controls.update();  // Update der OrbitControls bei jeder Frame
    renderer.render(scene, camera);
}

animate();
