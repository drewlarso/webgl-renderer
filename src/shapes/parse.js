export async function loadGLTF(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()

        const buffers = await Promise.all(
            data.buffers.map(async (buffer) => {
                const bufferResponse = await fetch(`public/${buffer.uri}`)
                return await bufferResponse.arrayBuffer()
            })
        )

        const extractAccessorData = (accessor, components) => {
            const bufferView = data.bufferViews[accessor.bufferView]
            const buffer = buffers[bufferView.buffer]
            const byteOffset =
                (bufferView.byteOffset || 0) + (accessor.byteOffset || 0)
            const count = accessor.count * components

            let TypedArray
            switch (accessor.componentType) {
                case 5120:
                    TypedArray = Int8Array
                    break
                case 5121:
                    TypedArray = Uint8Array
                    break
                case 5122:
                    TypedArray = Int16Array
                    break
                case 5123:
                    TypedArray = Uint16Array
                    break
                case 5125:
                    TypedArray = Uint32Array
                    break
                case 5126:
                    TypedArray = Float32Array
                    break
                default:
                    throw new Error('Unsupported component type')
            }
            return Array.from(new TypedArray(buffer, byteOffset, count))
        }

        let vertices = []
        let indices = []
        let uvs = []

        data.meshes.forEach((mesh) => {
            mesh.primitives.forEach((primitive) => {
                const { attributes, indices: indicesIndex } = primitive
                const accessors = data.accessors

                if (attributes.POSITION !== undefined) {
                    vertices.push(
                        ...extractAccessorData(
                            accessors[attributes.POSITION],
                            3
                        )
                    )
                }
                if (indicesIndex !== undefined) {
                    indices.push(
                        ...extractAccessorData(accessors[indicesIndex], 1)
                    )
                }
                if (attributes.TEXCOORD_0 !== undefined) {
                    uvs.push(
                        ...extractAccessorData(
                            accessors[attributes.TEXCOORD_0],
                            2
                        )
                    )
                }
            })
        })

        return {
            vertices: new Float32Array(vertices),
            indices: indices.length > 0 ? new Uint16Array(indices) : undefined,
            uvs: uvs.length > 0 ? new Float32Array(uvs) : undefined,
        }
    } catch (error) {
        console.error('Error loading GLTF:', error)
        throw error
    }
}
