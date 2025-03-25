precision mediump float;

uniform sampler2D uSampler;
uniform bool uTextured;

varying vec2 vTextureCoord;

void main() {
    if (uTextured) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    } else {
        gl_FragColor = vec4(vTextureCoord.xyy, 1.0);
    }
}
