import Cube from './shapes/Cube.js'
import Engine from './Engine.js'
import GLTF from './shapes/GLTF.js'
import Camera from './shaders/Camera.js'

const camera = new Camera([2, 1, 0], [0, 1, 0], [0, 1, 0])
const engine = new Engine(camera)
await engine.init()

engine.loadTexture('cipher', 'public/colors.png')

const cipher = new GLTF(engine, 'public/cipher.gltf', 'cipher')
await cipher.init()

let previousTimestamp = 0
const renderLoop = (timestamp) => {
    const dt = (timestamp - previousTimestamp) / 1000
    previousTimestamp = timestamp

    engine.render(dt)

    requestAnimationFrame(renderLoop)
}

requestAnimationFrame(renderLoop)
