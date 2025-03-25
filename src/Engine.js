export default class Engine {
    constructor() {
        this.canvas = document.querySelector('#glcanvas')
        this.gl = this.canvas.getContext('webgl')
        if (!this.gl) throw new Error('WebGL not supported')
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.depthFunc(this.gl.LESS)

        this.meshes = []
        this.buffers = new Map()
    }

    async init() {
        this.gl.clearColor(0.1, 0.0, 0.3, 1.0)
        this.clear()

        const vsSource = await (await fetch('src/shaders/debug.vs')).text()
        const fsSource = await (await fetch('src/shaders/debug.fs')).text()
        this.shaderProgram = this.initShaderProgram(vsSource, fsSource)
        this.gl.useProgram(this.shaderProgram)

        addEventListener('resize', this.resize.bind(this))
        this.resize()
        this.initMatrices()
        this.render()
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.initMatrices()
    }

    addMesh(mesh) {
        this.meshes.push(mesh)
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    render() {
        let previousTimestamp = 0
        const renderLoop = (timestamp) => {
            const dt = (timestamp - previousTimestamp) / 1000
            previousTimestamp = timestamp

            this.clear()

            for (const mesh of this.meshes) {
                if (mesh.render) mesh.render(dt)
            }

            requestAnimationFrame(renderLoop)
        }
        requestAnimationFrame(renderLoop)
    }

    initMatrices() {
        this.projectionViewMatrix = mat4.create()
        mat4.perspective(
            this.projectionViewMatrix,
            Math.PI / 2,
            this.canvas.width / this.canvas.height,
            1,
            100
        ) // matrix, fov, aspect, near, far

        const lookAtMatrix = mat4.create()
        mat4.lookAt(lookAtMatrix, [0, -6, 2], [0, 0, 0], [0, 0, 1]) // eye, at, up
        mat4.multiply(
            this.projectionViewMatrix,
            this.projectionViewMatrix,
            lookAtMatrix
        )

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
