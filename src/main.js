import Cube from './Cube.js'
import Engine from './Engine.js'
import Other from './Other.js'

const engine = new Engine()
await engine.init()

engine.addMesh(new Cube(engine))
engine.addMesh(new Other(engine, 4))
