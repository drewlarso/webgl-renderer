precision mediump float;

attribute vec4 aPosition;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionViewMatrix;

void main() {
    gl_Position = uProjectionViewMatrix * uModelMatrix * vec4(aPosition.xyz, 1.0);
}
