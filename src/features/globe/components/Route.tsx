import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ShaderMaterial, TubeGeometry } from 'three'
import { Color, AdditiveBlending } from 'three'
import { cities, routes, colors } from '../data/network'
import { toPosition } from '../math/coordinates'
import { FlightCurve } from '../math/FlightCurve'
import { routeWindow } from '../math/routeAnimation'
import { arcVertex, arcFragment } from '../shaders/route'
import {
  MAX_FRAME_DELTA,
  ROUTE_SEGMENTS,
  ROUTE_RADIAL_SEGMENTS,
  INDICES_PER_ROUTE_SEGMENT,
} from '../config'

/**
 * 一条有向飞线的 GPU 表示。CPU 只更新可见索引范围与两个 shader 边界。
 * 切换 Connections 会卸载所有 Route，再开启时各路线从零按顺序重新发射。
 * elapsed 属于该条路线的模拟时钟：暂停冻结、倍速缩放，后台恢复不追赶墙钟。
 */
// 稳定回调避免父组件更新时反复把可见区间清零；首帧前禁止显示完整弧线。
function hideBeforeFirstFrame(geometry: TubeGeometry) {
  geometry.setDrawRange(0, 0)
}

export function Route({
  pair,
  index,
  paused,
  speed,
}: {
  pair: readonly [number, number]
  index: number
  paused: boolean
  speed: number
}) {
  const material = useRef<ShaderMaterial>(null)
  const geometry = useRef<TubeGeometry>(null)
  const elapsed = useRef(0)
  const curve = useMemo(
    () =>
      new FlightCurve(
        toPosition(cities[pair[0]].lat, cities[pair[0]].lon, 1),
        toPosition(cities[pair[1]].lat, cities[pair[1]].lon, 1),
      ),
    [pair],
  )
  const uniforms = useMemo(
    () => ({
      uStart: { value: 0 },
      uEnd: { value: 0 },
      uColor: { value: new Color(colors[index % colors.length]) },
    }),
    [index],
  )
  useFrame((_, delta) => {
    if (!paused) elapsed.current += Math.min(delta, MAX_FRAME_DELTA) * speed
    const { start, end } = routeWindow(elapsed.current, index, routes.length)
    if (!geometry.current || !material.current) return
    // TubeGeometry 沿路线分为 160 段，每段 5 个侧面 × 2 三角形 × 3 索引。
    // floor/ceil 保守包含边界段；fragment shader 再裁掉不足一段的部分。
    const first = Math.floor(start * ROUTE_SEGMENTS)
    const last = Math.ceil(end * ROUTE_SEGMENTS)
    geometry.current.setDrawRange(
      first * INDICES_PER_ROUTE_SEGMENT,
      Math.max(0, last - first) * INDICES_PER_ROUTE_SEGMENT,
    )
    material.current.uniforms.uStart.value = start
    material.current.uniforms.uEnd.value = end
  })
  return (
    <mesh>
      <tubeGeometry
        ref={geometry}
        args={[curve, ROUTE_SEGMENTS, 0.005, ROUTE_RADIAL_SEGMENTS, false]}
        onUpdate={hideBeforeFirstFrame}
      />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={arcVertex}
        fragmentShader={arcFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
