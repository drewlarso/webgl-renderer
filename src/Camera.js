export default class Camera {
    constructor(position = [0, 1, 0], lookAt = [0, 0, 0], up = [0, 1, 0]) {
        this.position = position
        this.lookAt = lookAt
        this.up = up
        this.near = 0.1
        this.far = 1000
    }
}
