/**
 * 沿 TubeGeometry 的 uv.x 表示路线进度。CPU drawRange 粗裁剪，片元 discard 精裁剪。
 * uStart/uEnd 相等时没有任何像素；不使用透明底线。末端混入白色形成头部亮点。
 * AdditiveBlending 叠加发光，depthWrite=false 避免透明管线互相遮挡，depthTest 保留球体遮挡。
 */
export const arcVertex = `varying vec2 vUv; void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
export const arcFragment = `
uniform float uStart;
uniform float uEnd;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  // 完全丢弃可见区间之外的片元，隐藏阶段不会留下常驻淡线。
  if (uEnd <= uStart || vUv.x < uStart || vUv.x > uEnd) discard;
  // 末端 3.5% 混白模拟亮头，头尾各 0.4% 羽化避免硬切口。
  float tip = smoothstep(uEnd - .035, uEnd, vUv.x);
  float edge = smoothstep(0.0, .004, vUv.x-uStart) * (1.0-smoothstep(uEnd-.004,uEnd,vUv.x));
  gl_FragColor = vec4(mix(uColor,vec3(.9,.95,1.0),tip*.55), edge*.85);
}`
