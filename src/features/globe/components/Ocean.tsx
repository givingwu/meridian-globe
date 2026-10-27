import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import type { ShaderMaterial } from 'three'
import { AdditiveBlending } from 'three'
import { oceanVertex, oceanFragment } from '../shaders/ocean'
import { glowVertex, glowFragment } from '../shaders/atmosphere'
import type { AnimationProps } from '../types'
import { MAX_FRAME_DELTA } from '../config'

/**
 * 不透明海洋写入深度，遮挡背面的点阵和飞线；指针事件也阻断背面的城市命中。
 * 大气使用始终朝向相机的 Billboard 平面，透明相加混合且不写深度。
 * 两者的职责不同：不能把海洋直接改成全透明，否则背面几何会穿透出现。
 */
export function Ocean({ paused, speed }: AnimationProps) {
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, delta) => {
    if (material.current && !paused)
      material.current.uniforms.uTime.value +=
        Math.min(delta, MAX_FRAME_DELTA) * speed
  })
  return (
    <>
      <mesh
        onPointerOver={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={oceanVertex}
          fragmentShader={oceanFragment}
        />
      </mesh>
      <Billboard>
        <mesh>
          <planeGeometry args={[5.8, 5.8]} />
          <shaderMaterial
            vertexShader={glowVertex}
            fragmentShader={glowFragment}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </>
  )
}
