import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/test/vertex.glsl'
import fragmentShader from './shaders/test/fragment.glsl'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

var gui = new GUI();
var mouse, raycaster; 

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * RAYCASTER & MOUSE
 */

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 0
camera.position.z = 9
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * basic
 */
// Geometry
const geometry = new THREE.SphereBufferGeometry(1, 152, 152)

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

/**
 * LIGHTS
 */


//Material
const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: true,
    // transparent: true,
    uniforms: {
        uFrequency: {value : new THREE.Vector2(20, 20)},
        uTime : { value: 1 }
    }
})

const material2 = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: true,
    uniforms: {
        uFrequency: {value : new THREE.Vector2(0, 20)},
        uTime : { value: 1 }
    }
})


const material3 = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: true,
    uniforms: {
        uFrequency: {value : new THREE.Vector2(5, 10)},
        uTime : { value: 1 }
    }
})

var points = new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.01,
    color: "white"
 }));

 scene.add(points);

 

var points2 = points.clone()
points2.position.set(3, 0, 0)
scene.add(points2)

var points3 = points.clone()
points3.position.set(-3, 0, 0)
scene.add(points3)

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')
gui.add(material2.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX material 2')
gui.add(material2.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY material 2')


// Mesh
const mesh = new THREE.Mesh(geometry, material)

const mesh2 = new THREE.Mesh(geometry, material2)
mesh2.position.x = 3
mesh2.position.y = 0
mesh2.position.z = 0

const mesh3 = new THREE.Mesh(geometry, material3)
mesh3.position.x = -3
mesh3.position.y = 0
mesh3.position.z = 0


scene.add(mesh2)
scene.add(mesh)
scene.add(mesh3)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


 function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );

const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObject( mesh );




	for ( let i = 0; i < intersects.length; i ++ ) {
        // console.log(intersects[i].faceIndex)
        window.addEventListener('mousedown', ()=> {
            // var points4 = points.clone()
            // points4.position.set(1, Math.random() * i, 1);
            // scene.add(points4)
            camera.position.z = 0
            camera.position.x = 0
            camera.position.y = 0
        });
	}


    // Update material 
    material.uniforms.uTime.value = elapsedTime;
    material2.uniforms.uTime.value = elapsedTime;
    material3.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()