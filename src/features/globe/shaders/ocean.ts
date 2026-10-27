/**
 * 海洋球是实心深度遮挡层，背面城市和航线由深度测试自然隐藏。
 * 顶点传递视空间法线与模型空间位置，片元根据朝向混合蓝紫色和轮廓光。
 * uTime 只控制细微变化，暂停时由组件冻结该 uniform。
 */
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
  // 掠射角处增强边缘光；pow 控制光带宽度，不改变几何轮廓。
  float edge = pow(1.0 - max(n.z, 0.0), 2.8);
  float light = smoothstep(-0.7, 0.85, dot(n, normalize(vec3(-0.6, 0.7, 0.8))));
  // 模型空间位置使色带随球体固定；低频时间项让渐变缓慢呼吸。
  float wave = sin(vPosition.y * 2.0 + vPosition.x * 1.2 + uTime * 0.14);
  float aurora = smoothstep(0.1, 1.0, wave) * (0.5 + 0.5 * n.y);
  vec3 base = mix(vec3(0.025,0.065,0.13), vec3(0.10,0.18,0.31), light);
  base += aurora * vec3(0.025,0.025,0.065);
  gl_FragColor = vec4(base + edge * vec3(0.025,0.045,0.09), 1.0);
}`
