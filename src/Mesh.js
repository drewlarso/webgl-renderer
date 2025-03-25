export default class Mesh {
    constructor(engine, name, x = 0, y = 0, z = 0) {
        this.engine = engine
        this.gl = this.engine.gl
        this.shaderProgram = this.engine.shaderProgram
        this.name = name

        this.position = [x, y, z]
        this.rotation = [0, 0, 0]
        this.scale = [1, 1, 1]

        this.vertices = null
        this.indices = null
        this.uvs = null

        this.modelMatrix = mat4.create()
        this.initData()
        this.updateBuffers()
    }

    update(dt) {
        mat4.identity(this.modelMatrix)
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position)
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0])
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1])
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2])
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale)
        const modelMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            'uModelMatrix'
        )
        this.gl.uniformMatrix4fv(modelMatrixLocation, false, this.modelMatrix)

        this.updateBuffers()
    }

    render(dt) {
        this.update(dt)

        if (this.indices) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
            this.gl.drawElements(
                this.gl.TRIANGLES,
                this.indices.length,
                this.gl.UNSIGNED_SHORT,
                0
            )
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 3)
        }
    }

    initData() {
        throw new Error(`Override initData() in ${this.name}!!!`)
    }

    updateBuffers() {
        this.vertexBuffer = this.createBuffer(
            this.gl.ARRAY_BUFFER,
            this.vertices
        )
        this.enableAttribute(
            'aVertexPosition',
            3,
            this.gl.FLOAT,
            Float32Array.bytesPerElement
        )

        if (this.indices) {
            this.indexBuffer = this.createBuffer(
                this.gl.ELEMENT_ARRAY_BUFFER,
                this.indices
            )
        }

        if (this.uvs) {
            this.uvBuffer = this.createBuffer(this.gl.ARRAY_BUFFER, this.uvs)
            this.enableAttribute(
                'aTextureCoord',
                2,
                this.gl.FLOAT,
                Float32Array.bytesPerElement
            )
        }
    }

    createBuffer(type, data) {
        const buffer = this.gl.createBuffer()
        this.gl.bindBuffer(type, buffer)
        this.gl.bufferData(type, data, this.gl.STATIC_DRAW)
        return buffer
    }

    enableAttribute(name, elements, type, bytesPerElement) {
        const location = this.gl.getAttribLocation(this.shaderProgram, name)
        this.gl.vertexAttribPointer(
            location,
            elements,
            type,
            this.gl.FALSE,
            elements * bytesPerElement,
            0
        )
        this.gl.enableVertexAttribArray(location)
    }
}
