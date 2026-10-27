import { useEffect, useMemo } from 'react'
import type { ComponentRef, RefObject } from 'react'
import type { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraTransition } from '../math/CameraTransition'
import type { GlobeProps } from '../types'

type Controls = ComponentRef<typeof OrbitControls>

/**
 * React 只传递用户命令；连续运动完全属于 Three.js。
 * 单个 Effect 消费最新命令，懒加载完成时不会被另一个初始化 Effect 覆盖。
 * 每帧 -2 优先级先处理目标与自动旋转开关，Drei OrbitControls 的 -1 随后更新。
 * 两者不会同时自动驱动镜头；用户 pointerdown/wheel 则立即取回控制权。
 */
export function CameraMotion({
  controlsRef,
  cameraCommand,
  selected,
  paused,
  onSelect,
}: Pick<GlobeProps, 'cameraCommand' | 'selected' | 'paused' | 'onSelect'> & {
  controlsRef: RefObject<Controls | null>
}) {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const motion = useMemo(() => new CameraTransition(), [])
  useEffect(() => {
    const controls = controlsRef.current
    if (controls && cameraCommand.type !== 'idle') {
      // 清空上一段手动拖动的阻尼余量，避免它与新的程序过渡叠加。
      // OrbitControls 在关闭 damping 的一次 update 后清空 sphericalDelta。
      const damping = controls.enableDamping
      controls.autoRotate = false
      controls.enableDamping = false
      controls.update()
      controls.enableDamping = damping
    }
    motion.apply(cameraCommand, camera.position)
  }, [cameraCommand, camera, controlsRef, motion])
  useFrame((_, delta) => {
    const controls = controlsRef.current
    const wasMoving = motion.active
    motion.advance(camera.position, delta)
    if (wasMoving) camera.lookAt(0, 0, 0)
    if (controls)
      controls.autoRotate = !motion.active && !paused && selected === null
  }, -2)
  useEffect(() => {
    const controls = controlsRef.current
    const stop = () => {
      motion.cancel()
      onSelect(null)
    }
    // capture 在 OrbitControls 自己的事件处理前执行；wheel 监听只观察，不阻止滚动。
    const element = gl.domElement
    element.addEventListener('pointerdown', stop, { capture: true })
    element.addEventListener('wheel', stop, { capture: true, passive: true })
    return () => {
      element.removeEventListener('pointerdown', stop, true)
      element.removeEventListener('wheel', stop, true)
      motion.reset()
      if (controls) controls.autoRotate = false
    }
  }, [gl, motion, onSelect, controlsRef])
  return null
}
