precision mediump float;

varying vec2 vTextureCoord;

void main() {
    gl_FragColor = vec4(vTextureCoord.xyy, 1.0);
}
