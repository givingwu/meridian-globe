/**
 * 顶点着色器在 GPU 中计算点大小与呼吸亮度，CPU 不逐点更新。
 * uPixelRatio 适配 Canvas DPR；透视距离缩放让远端点自然缩小。
 * 片元以 gl_PointCoord 构造圆点，避免默认方形颗粒；法线/视角共同控制边缘衰减。
 */
export const pointVertex = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vLight;
varying float vTint;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 norm = normalize(normalMatrix * normalize(position));
  // 视空间 +Z 朝向观察者；削弱球体侧缘与背面，减轻密集点阵的轮廓锯齿。
  float front = smoothstep(-0.05, 0.55, norm.z);
  // 每点固定种子错开相位；改变时间只更新 uniform，不上传新坐标。
  vLight = (0.78 + 0.22 * sin(uTime * 0.7 + aSeed * 70.0)) * front;
  vTint = sin(position.y * 1.8 + position.x * 1.2 + uTime * 0.12) * 0.5 + 0.5;
  gl_Position = projectionMatrix * mv;
  // 负 mv.z 是相机前方距离；先限制逻辑尺寸，再换算为设备像素。
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
