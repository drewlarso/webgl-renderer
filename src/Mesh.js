export default class Mesh {
    constructor(engine, name, x = 0, y = 0, z = 0, texture = null) {
        this.engine = engine
        this.gl = this.engine.gl
        this.shaderProgram = this.engine.shaderProgram
        this.name = name

        this.position = { x, y, z }
        this.rotation = { x: 0, y: 0, z: 0 }
        this.scale = { x: 1, y: 1, z: 1 }

        this.vertices = null
        this.indices = null
        this.uvs = null
        this.texture = texture

        this.modelMatrix = mat4.create()
        this.initData()
        this.updateBuffers()
    }

    update(dt) {
        mat4.identity(this.modelMatrix)
        mat4.translate(this.modelMatrix, this.modelMatrix, [
            this.position.x,
            this.position.y,
            this.position.z,
        ])
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation.x)
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation.y)
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation.z)
        mat4.scale(this.modelMatrix, this.modelMatrix, [
            this.scale.x,
            this.scale.y,
            this.scale.z,
        ])
        const modelMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            'uModelMatrix'
        )
        this.gl.uniformMatrix4fv(modelMatrixLocation, false, this.modelMatrix)

        if (this.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0)
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
            this.gl.uniform1i(
                this.gl.getUniformLocation(this.shaderProgram, 'uSampler'),
                0
            )
            this.gl.uniform1i(
                this.gl.getUniformLocation(this.shaderProgram, 'uTextured'),
                true
            )
        } else {
            this.gl.uniform1i(
                this.gl.getUniformLocation(this.shaderProgram, 'uTextured'),
                false
            )
        }

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
