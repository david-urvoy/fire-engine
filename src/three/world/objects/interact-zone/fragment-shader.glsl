uniform vec3 uColor;

varying vec2 vUv;

void main() {
	float strength = step(0.3, 0.15 / (distance(vUv, vec2(0.5))));
	gl_FragColor = vec4(uColor, strength);
}
