import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ShaderMaterial } from 'three'
import land from '../data/land.json'
import { pointVertex, pointFragment } from '../shaders/points'
import type { AnimationProps } from '../types'
import { MAX_FRAME_DELTA } from '../config'

/**
 * 所有陆地点共用一个 BufferGeometry / Points 绘制调用。
 * 坐标与确定性随机种子只在组件生命周期内构造一次，交互更新不重算点阵。
 * 动画通过 uniform 更新，不把逐帧时间放进 React state，避免触发 DOM 协调。
 * 声明式几何和材质由 R3F 在卸载时 dispose，不手动释放仍在使用的资源。
 */
const landCount = land.length / 3

export function Land({ paused, speed }: AnimationProps) {
  const material = useRef<ShaderMaterial>(null)
  const pixelRatio = useThree((state) => state.viewport.dpr)
  const positions = useMemo(
    () => new Float32Array(land.map((v) => v * 2.006)),
    [],
  )
  const seeds = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: landCount }, (_, i) => (i * 0.6180339) % 1),
      ),
    [],
  )
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }),
    [],
  )
  useFrame((_, delta) => {
    // DPR 变化只修改 uniform，不重建材质或重置闪烁时间。
    if (material.current)
      material.current.uniforms.uPixelRatio.value = pixelRatio
    if (material.current && !paused)
      material.current.uniforms.uTime.value +=
        Math.min(delta, MAX_FRAME_DELTA) * speed
  })
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={pointVertex}
        fragmentShader={pointFragment}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
