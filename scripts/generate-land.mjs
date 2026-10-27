import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
import { geoContains } from 'd3-geo'
const world = JSON.parse(
  readFileSync(
    new URL('../node_modules/world-atlas/land-110m.json', import.meta.url),
  ),
)
const land = feature(world, world.objects.land)
const points = []
// 离线生成：渲染时无需加载轮廓库，也无需重复执行点在多边形内的测试。
// y 等间距对应等面积纬度带，黄金角分散经度，避免经纬网在极点过密。
// 采样取单元中心 i+0.5，既不重复极点，也避免 sqrt 的浮点边界问题。
for (let i = 0; i < 68000; i++) {
  const y = 1 - (2 * (i + 0.5)) / 68000
  const lat = (Math.asin(y) * 180) / Math.PI
  const lon = ((i * 137.50776405003785) % 360) - 180
  // GeoJSON 使用 [经度, 纬度]（角度），不要与 Three.js 的 XYZ 混用。
  if (!geoContains(land, [lon, lat])) continue
  const r = Math.sqrt(1 - y * y),
    angle = (lon * Math.PI) / 180
  // 输出单位球坐标：北极 +Y、经度 0 朝 +Z。运行时统一乘陆地半径。
  // 保留 6 位小数减小静态 JSON；误差远小于最终点的屏幕尺寸。
  points.push(
    ...[r * Math.sin(angle), y, r * Math.cos(angle)].map((n) => +n.toFixed(6)),
  )
}
writeFileSync(
  new URL('../src/features/globe/data/land.json', import.meta.url),
  JSON.stringify(points),
)
console.log(
  `Generated ${points.length / 3} land points from Natural Earth / world-atlas.`,
)
