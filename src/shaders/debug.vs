precision mediump float;

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionViewMatrix;

varying vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionViewMatrix * uModelMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;
}
