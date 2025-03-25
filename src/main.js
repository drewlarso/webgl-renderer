import Cube from './shapes/Cube.js'
import Engine from './Engine.js'
import TexturedQuad from './shapes/TexturedQuad.js'

const engine = new Engine()
await engine.init()

engine.loadTexture('debug', 'public/debug.png')
engine.loadTexture('creeper', 'public/creeper.png')

engine.addMesh(new Cube(engine))
engine.addMesh(new TexturedQuad(engine, 'debug', 3))
engine.addMesh(new TexturedQuad(engine, 'creeper', -3))
