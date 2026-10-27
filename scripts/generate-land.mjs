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
// Fibonacci sphere: equal-area samples, with no crowding at the poles.
for (let i = 0; i < 68000; i++) {
  const y = 1 - (2 * (i + 0.5)) / 68000
  const lat = (Math.asin(y) * 180) / Math.PI
  const lon = ((i * 137.50776405003785) % 360) - 180
  if (!geoContains(land, [lon, lat])) continue
  const r = Math.sqrt(1 - y * y),
    angle = (lon * Math.PI) / 180
  points.push(
    ...[r * Math.sin(angle), y, r * Math.cos(angle)].map((n) => +n.toFixed(6)),
  )
}
writeFileSync(
  new URL('../src/land.json', import.meta.url),
  JSON.stringify(points),
)
console.log(
  `Generated ${points.length / 3} land points from Natural Earth / world-atlas.`,
)
