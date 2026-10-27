import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { Quaternion, Vector3 } from 'three'
import { cities, colors } from '../data/network'
import { toPosition } from '../math/coordinates'
import type { GlobeProps } from '../types'
import { MAX_FRAME_DELTA } from '../config'

/**
 * 城市视觉、点击命中体与标签分离：小圆点负责呈现，透明球扩大可点击区域。
 * 平面默认法线 +Z，四元数把它转向城市径向，使圆点/光圈贴合球面。
 * 当前光圈保持独立循环（已回滚到达触发试验），不是交易到达事件。
 * 只有 hovered/selected 属于 React 状态；扩散尺度和透明度直接更新 ref。
 */
export function CityMarker({
  index,
  paused,
  speed,
  selected,
  onSelect,
}: { index: number } & Pick<
  GlobeProps,
  'paused' | 'speed' | 'selected' | 'onSelect'
>) {
  const city = cities[index]
  const [hovered, setHovered] = useState(false)
  const ring = useRef<Mesh>(null)
  const pulse = useRef<MeshBasicMaterial>(null)
  const time = useRef(index * 0.37)
  const position = useMemo(() => toPosition(city.lat, city.lon, 2.025), [city])
  const quaternion = useMemo(
    () =>
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  )
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, MAX_FRAME_DELTA) * speed
    // 2.5 秒一个独立周期，城市索引错峰；尺度线性扩张，透明度二次衰减。
    // 即使暂停也按当前 phase 写回，确保首次暂停渲染仍有确定的外观。
    const phase = (time.current % 2.5) / 2.5
    if (ring.current) ring.current.scale.setScalar(1 + phase * 2.5)
    if (pulse.current) pulse.current.opacity = 0.5 * (1 - phase) ** 2
  })
  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={ring}>
        <ringGeometry args={[0.024, 0.029, 32]} />
        <meshBasicMaterial
          ref={pulse}
          color={colors[index % colors.length]}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <circleGeometry args={[selected === index ? 0.027 : 0.016, 16]} />
        <meshBasicMaterial
          color={
            hovered || selected === index
              ? '#ffffff'
              : colors[index % colors.length]
          }
        />
      </mesh>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(index)
        }}
      >
        <sphereGeometry args={[0.034, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {(hovered || selected === index) && (
        <Html
          center
          occlude
          position={[0, 0.11, 0.04]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="city-label">
            {city.name}
            <span>{city.country}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
