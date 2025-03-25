import Mesh from '../Mesh.js'

export default class Empty extends Mesh {
    constructor(
        engine,
        textureKey = '',
        vertices,
        indices = null,
        uvs = null,
        x = 0,
        y = 0,
        z = 0
    ) {
        super(engine, 'Empty', x, y, z, engine.textures.get(textureKey))
        if (vertices) this.vertices = new Float32Array(vertices)
        if (indices) this.indices = new Uint16Array(indices)
        if (uvs) this.uvs = new Float32Array(uvs)
        this.updateBuffers()
    }

    render(dt) {
        super.render(dt)
    }

    initData() {}
}
