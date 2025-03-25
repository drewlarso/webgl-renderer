import Cube from './shapes/Cube.js'
import Engine from './Engine.js'
import GLTF from './shapes/GLTF.js'
import Camera from './Camera.js'

const camera = new Camera([0, 2, 3], [0, 1, 0], [0, 1, 0])
const engine = new Engine(camera)
await engine.init()

engine.loadTexture('cipher', 'public/colors.png')
engine.loadTexture('spamton', 'public/spamton.png')

const cipher = new GLTF(engine, 'public/cipher.gltf', 'cipher')
await cipher.init()
cipher.rotation.y = Math.PI / -10
cipher.position.z = -1
cipher.position.x = -1
const spamton = new GLTF(engine, 'public/spamton_idle.gltf', 'spamton')
await spamton.init()
spamton.position.x = 2

let previousTimestamp = 0
const renderLoop = (timestamp) => {
    const dt = (timestamp - previousTimestamp) / 1000
    previousTimestamp = timestamp

    spamton.rotation.y += 2 * dt
    cipher.position.y = Math.sin(spamton.rotation.y * 2) / 5
    engine.render(dt)

    requestAnimationFrame(renderLoop)
}

requestAnimationFrame(renderLoop)
