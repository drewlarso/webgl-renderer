import Mesh from '../Mesh.js'

export default class Cube extends Mesh {
    constructor(engine, x, y, z) {
        super(engine, 'Cube', x, y, z)
    }

    render(dt) {
        super.render(dt)

        this.rotation[0] += 0.01
        this.rotation[1] += 0.01
        this.rotation[2] += 0.01
    }

    initData() {
        this.vertices = new Float32Array([
            // Front face
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ])

        this.indices = new Uint16Array([
            0,
            1,
            2,
            0,
            2,
            3, // Front face
            4,
            5,
            6,
            4,
            6,
            7, // Back face
            8,
            9,
            10,
            8,
            10,
            11, // Top face
            12,
            13,
            14,
            12,
            14,
            15, // Bottom face
            16,
            17,
            18,
            16,
            18,
            19, // Right face
            20,
            21,
            22,
            20,
            22,
            23, // Left face
        ])

        this.uvs = new Float32Array([
            // Front face
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Back face
            1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
            // Top face
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            // Bottom face
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Right face
            1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
            // Left face
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ])
    }
}
