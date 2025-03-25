import Mesh from '../Mesh.js'

export default class Empty extends Mesh {
    constructor(
        engine,
        textureKey = '',
        vertices = null,
        indices = null,
        uvs = null,
        x = 0,
        y = 0,
        z = 0
    ) {
        super(engine, 'Empty', x, y, z, engine.textures.get(textureKey))
        this.vertices = new Float32Array(vertices)
        if (indices) this.indices = new Uint16Array(indices)
        if (uvs) this.uvs = new Float32Array(uvs)
    }

    render(dt) {
        super.render(dt)

        this.rotation[2] += 0.01
    }

    initData() {}
}
