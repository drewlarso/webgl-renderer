export default class Mesh {
    constructor(x = 0, y = 0, z = 0) {
        this.position = [x, y, z]
        this.rotation = [0, 0, 0]
        this.scale = [1, 1, 1]

        this.initBuffers()
    }

    initBuffers() {
        throw new Error('Buffers not implemented in one of your shapes?')
    }
}
