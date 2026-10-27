/**
 * 光晕绘制在始终朝向相机的 Billboard 平面上。
 * 片元根据中心距离构造柔和光环与上下色调，避免给地球加厚硬边。
 * 平面不写入深度，透明叠加；参数与海洋球视觉尺寸配套调整。
 */
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
