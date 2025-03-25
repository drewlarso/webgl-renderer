import Cube from './shapes/Cube.js'
import Engine from './Engine.js'
import TexturedQuad from './shapes/TexturedQuad.js'
import { loadGLTF } from './shapes/parse.js'
import Empty from './shapes/Empty.js'

const engine = new Engine()
await engine.init()

// engine.loadTexture('debug', 'public/debug.png')
// engine.loadTexture('creeper', 'public/creeper.png')
engine.loadTexture('cipher', 'public/colors.png')

// engine.addMesh(new Cube(engine))
// engine.addMesh(new TexturedQuad(engine, 'debug', 3))
// engine.addMesh(new TexturedQuad(engine, 'creeper', -3))

// need to put in texture key manually for now
// await cipher.loadModel('public/cipher.gltf')
// engine.addMesh(new GLTF(engine, 'public/cipher.gltf', 'cipher'))

const model = await loadGLTF('public/cipher.gltf')
const cipher = new Empty(
    engine,
    'cipher',
    model.vertices,
    model.indices,
    model.uvs
)
engine.addMesh(cipher)
