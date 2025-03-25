import Mesh from '../Mesh.js'

export default class TexturedQuad extends Mesh {
    constructor(engine, textureKey, x, y, z) {
        super(engine, 'Quad', x, y, z, engine.textures.get(textureKey))
        this.scale = [3, 3, 3]
    }

    render(dt) {
        super.render(dt)
        this.rotation[2] += 0.01
    }

    initData() {
        this.vertices = new Float32Array([
            0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1,
        ])

        this.uvs = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ])
    }
}
