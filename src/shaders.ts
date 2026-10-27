export const pointVertex = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vLight;
varying float vTint;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 norm = normalize(normalMatrix * normalize(position));
  float front = smoothstep(-0.05, 0.55, norm.z);
  vLight = (0.78 + 0.22 * sin(uTime * 0.7 + aSeed * 70.0)) * front;
  vTint = sin(position.y * 1.8 + position.x * 1.2 + uTime * 0.12) * 0.5 + 0.5;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(10.5 / -mv.z, 1.0, 4.0) * uPixelRatio;
}`
export const pointFragment = `
varying float vLight;
varying float vTint;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 color = mix(vec3(0.31,0.51,0.73), vec3(0.55,0.64,0.88), vTint);
  gl_FragColor = vec4(color, (1.0-smoothstep(0.30,0.5,d)) * vLight);
}`
export const oceanVertex = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`
export const oceanFragment = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 n = normalize(vNormal);
  float edge = pow(1.0 - max(n.z, 0.0), 2.8);
  float light = smoothstep(-0.7, 0.85, dot(n, normalize(vec3(-0.6, 0.7, 0.8))));
  float wave = sin(vPosition.y * 2.0 + vPosition.x * 1.2 + uTime * 0.14);
  float aurora = smoothstep(0.1, 1.0, wave) * (0.5 + 0.5 * n.y);
  vec3 base = mix(vec3(0.025,0.065,0.13), vec3(0.10,0.18,0.31), light);
  base += aurora * vec3(0.025,0.025,0.065);
  gl_FragColor = vec4(base + edge * vec3(0.025,0.045,0.09), 1.0);
}`
export const glowVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`
export const glowFragment = `
varying vec2 vUv;
void main(){
  vec2 p = vUv - .5;
  float radius = length(p);
  float halo = smoothstep(.26,.36,radius) * (1.0-smoothstep(.36,.50,radius));
  vec3 color = mix(vec3(.42,.12,.40), vec3(.10,.30,.52), smoothstep(-.22,.25,p.y-p.x));
  gl_FragColor = vec4(color, halo * .42);
}`
export const arcVertex = `varying vec2 vUv; void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
export const arcFragment = `
uniform float uStart;
uniform float uEnd;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  // No baseline: pixels outside the growing/receding interval do not exist.
  if (uEnd <= uStart || vUv.x < uStart || vUv.x > uEnd) discard;
  float tip = smoothstep(uEnd - .035, uEnd, vUv.x);
  float edge = smoothstep(0.0, .004, vUv.x-uStart) * (1.0-smoothstep(uEnd-.004,uEnd,vUv.x));
  gl_FragColor = vec4(mix(uColor,vec3(.9,.95,1.0),tip*.55), edge*.85);
}`
