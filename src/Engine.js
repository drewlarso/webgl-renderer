export default class Engine {
    constructor() {
        this.canvas = document.querySelector('#glcanvas')
        this.gl = this.canvas.getContext('webgl')
        if (!this.gl) throw new Error('WebGL not supported')
    }

    async init() {
        this.gl.clearColor(0.1, 0.0, 0.3, 1.0)
        this.clear()

        const vsSource = await (await fetch('src/shaders/debug.vs')).text()
        const fsSource = await (await fetch('src/shaders/debug.fs')).text()
        this.shaderProgram = this.initShaderProgram(vsSource, fsSource)
        this.gl.useProgram(this.shaderProgram)

        this.initMatrices()
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    initMatrices() {
        this.projectionViewMatrix = mat4.create()
        mat4.perspective(this.projectionViewMatrix, Math.PI / 2, 1, 100) // matrix, fov, near, far

        const lookAtMatrix = mat4.create()
        mat4.lookAt(lookAtMatrix, [1, 1, 1], [0, 0, 0], [0, 0, 1]) // eye, at, up

        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(
                this.shaderProgram,
                'uProjectionViewMatrix'
            ),
            false,
            this.projectionViewMatrix
        )

        // this is gonna be overidden but still needs to be here i think
        this.modelMatrix = mat4.create()
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uModelMatrix'),
            false,
            this.modelMatrix
        )
    }

    initShaderProgram(vsSource, fsSource) {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource)
        const fragmentShader = this.loadShader(
            this.gl.FRAGMENT_SHADER,
            fsSource
        )

        const shaderProgram = this.gl.createProgram()
        this.gl.attachShader(shaderProgram, vertexShader)
        this.gl.attachShader(shaderProgram, fragmentShader)
        this.gl.linkProgram(shaderProgram)

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
            throw new Error(
                `Unable to init shader program: ${this.gl.getProgramInfoLog(
                    shaderProgram
                )}`
            )

        return shaderProgram
    }

    loadShader(type, source) {
        const shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(
                `Error when compiling shaders: ${this.gl.getShaderInfoLog(
                    shader
                )}`
            )
        }
        return shader
    }
}
