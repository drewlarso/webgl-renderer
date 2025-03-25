import Empty from './Empty.js'

export default class GLTF {
    constructor(engine, url, textureKey, x, y, z) {
        this.engine = engine
        this.url = url
        this.textureKey = textureKey

        this.position = [0, 0, 0]
        this.rotation = [0, 0, 0]
        this.scale = [1, 1, 1]

        this.meshes = []
        this.buffers = []
    }

    async init() {
        try {
            const response = await fetch(this.url)
            const data = await response.json()
            await this.parseBuffers(data)
            this.parseMeshes(data)
            this.updateLocation(this.position, this.rotation, this.scale)
        } catch (error) {
            throw error
        }
    }

    updateLocation(position, rotation, scale) {
        for (const mesh of this.meshes) {
            mesh.position = position
            mesh.rotation = rotation
            mesh.scale = scale
        }
    }

    setPosition(position) {
        this.position = position
        for (const mesh of this.meshes) {
            mesh.position = position
        }
    }

    setRotation(rotation) {
        this.rotation = rotation
        for (const mesh of this.meshes) {
            mesh.rotation = rotation
        }
    }

    setScale(scale) {
        this.scale = scale
        for (const mesh of this.meshes) {
            mesh.scale = scale
        }
    }

    async parseBuffers(data) {
        this.bufferViews = data.bufferViews || []
        this.accessors = data.accessors || []

        const buffers = await Promise.all(
            data.buffers.map(async (buffer) => {
                const response = await fetch(`public/${buffer.uri}`)
                const arrayBuffer = await response.arrayBuffer()
                return arrayBuffer
            })
        )
        this.buffers = buffers
    }

    parseMeshes(data) {
        data.meshes.forEach((mesh) => {
            let vertices = []
            let indices = []
            let uvs = []
            mesh.primitives.forEach((primitive) => {
                const positionAccessor =
                    this.accessors[primitive.attributes.POSITION]
                vertices.push(...this.extractAccessorData(positionAccessor, 3))

                if (primitive.indices !== undefined) {
                    const indexAccessor = this.accessors[primitive.indices]
                    indices.push(...this.extractAccessorData(indexAccessor, 1))
                }

                if (primitive.attributes.TEXCOORD_0 !== undefined) {
                    const uvAccessor =
                        this.accessors[primitive.attributes.TEXCOORD_0]
                    uvs.push(...this.extractAccessorData(uvAccessor, 2))
                }
            })
            const m = new Empty(
                this.engine,
                this.textureKey,
                vertices,
                indices,
                uvs
            )
            this.engine.addMesh(m)
            this.meshes.push(m)
        })
    }

    extractAccessorData(accessor, components) {
        const bufferView = this.bufferViews[accessor.bufferView]
        const buffer = this.buffers[bufferView.buffer]
        const byteOffset =
            (bufferView.byteOffset || 0) + (accessor.byteOffset || 0)

        let typedArray
        switch (accessor.componentType) {
            case 5120:
                typedArray = Int8Array
                break
            case 5121:
                typedArray = Uint8Array
                break
            case 5122:
                typedArray = Int16Array
                break
            case 5123:
                typedArray = Uint16Array
                break
            case 5125:
                typedArray = Uint32Array
                break
            case 5126:
                typedArray = Float32Array
                break
            default:
                throw new Error('Unsupported component type')
        }

        const dataView = new typedArray(
            buffer,
            byteOffset,
            accessor.count * components
        )

        return Array.from(dataView)
    }
}
