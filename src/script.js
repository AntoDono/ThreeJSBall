import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/textures/height_normal_map.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64 )
// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture

material.color = new THREE.Color(15892991)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


// Light2
const light2 = gui.addFolder("Light 2")

const pointLight2 = new THREE.PointLight("#00e8ca", 0.1)
pointLight2.position.set(-1,1.7,-0.47)
pointLight2.intensity = 2.35

light2.add(pointLight2.position, 'y').min(-100).max(100).step(0.01)
light2.add(pointLight2.position, 'x').min(-100).max(100).step(0.01)
light2.add(pointLight2.position, 'z').min(-100).max(100).step(0.01)
light2.add(pointLight2, 'intensity').min(-100).max(100).step(0.01)

const light2Color = {
    color: "#00e8ca"
}

light2.addColor(light2Color, 'color')
.onChange(()=>{
    pointLight2.color.set(light2Color.color)
})

scene.add(pointLight2)


// Light 3
const light3 = gui.addFolder("Light 3")

const pointLight3 = new THREE.PointLight("#f28150", 0.1)
pointLight3.position.set(1,-0.87,-0.32)
pointLight3.intensity = 2.35

light3.add(pointLight3.position, 'x').min(-100).max(100).step(0.01)
light3.add(pointLight3.position, 'z').min(-100).max(100).step(0.01)
light3.add(pointLight3.position, 'y').min(-100).max(100).step(0.01)
light3.add(pointLight3, 'intensity').min(-100).max(100).step(0.01)

const light3Color = {
    color: "#f28150"
}

light3.addColor(light3Color, 'color')
.onChange(()=>{
    pointLight3.color.set(light3Color.color)
})

scene.add(pointLight3)

// const pointLightHelper = new THREE.PointLightHelper(pointLight3, 1)
// scene.add(pointLightHelper)
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

let light2change = 0.005
let light3change = 0.005


const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

const onDocumentMouseMove = (event) =>{
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

const updateSphere = (event)=>{
    sphere.position.y = window.scrollY * 0.001
}

const updatePosition = ()=>{
    pointLight2.position.x+=light2change
    if (pointLight2.position.x > 1) light2change = -0.005
    else if (pointLight2.position.x < -1) light2change = 0.005

    pointLight3.position.x+=light3change
    if (pointLight3.position.x > 1) light3change = -0.005
    else if (pointLight3.position.x < -1) light3change = 0.005

}

window.addEventListener('scroll', updateSphere)

document.addEventListener('mousemove', onDocumentMouseMove)

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .5 * (targetY - sphere.rotation.x)
    sphere.rotation.z += .5 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    updatePosition()

}

tick()