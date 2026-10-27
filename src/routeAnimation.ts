/** A staggered reveal followed by origin-to-destination retreat, matching the supplied demo. */
export function routeWindow(time: number, index: number, routeCount: number) {
  const seed = (index * 0.61803398875) % 1
  const grow = 1.3 + seed * 0.4
  const retreat = 2.8 + seed * 0.8
  const cycle = Math.max(routeCount * 0.4, grow + retreat + 0.8)
  const elapsed = time - index * 0.4
  if (elapsed < 0) return { start: 0, end: 0 }
  const age = elapsed % cycle
  if (age < grow) {
    const t = age / grow
    return { start: 0, end: t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t) }
  }
  if (age < grow + retreat) {
    const t = (age - grow) / retreat
    let start = t * t * (3 - 2 * t)
    if (start < 0.2) start = start * start * 5
    return { start, end: 1 }
  }
  return { start: 0, end: 0 }
}
