import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Quaternion, Vector3 } from 'three'
import { cities } from '../data/network'
import { toPosition } from '../math/coordinates'
import {
  HOME_POSITION,
  MIN_CAMERA_DISTANCE,
  MAX_CAMERA_DISTANCE,
  MAX_FRAME_DELTA,
} from '../config'
import type { GlobeProps } from '../types'

/**
 * 将用户的离散命令同步到 Three.js 相机；Effect 用于外部对象同步，而非派生 UI 状态。
 * selected 是目标城市，reset 是递增命令号，zoom 的符号表示方向、绝对值区分连续点击。
 * 每帧分别插值方向和半径，防止 XYZ 直线插值沿弦穿过地球。
 * 拖动时立即取消程序动画，把相机控制权归还 OrbitControls。
 */
export function CameraMotion({
  selected,
  reset,
  zoom,
  onSelect,
}: Pick<GlobeProps, 'selected' | 'reset' | 'zoom' | 'onSelect'>) {
  const { camera } = useThree()
  const target = useRef<Vector3 | null>(null)
  const turn = useMemo(() => new Quaternion(), [])
  const step = useMemo(() => new Quaternion(), [])
  const direction = useMemo(() => new Vector3(), [])
  useEffect(() => {
    if (selected !== null)
      target.current = toPosition(
        cities[selected].lat,
        cities[selected].lon,
        camera.position.length(),
      )
  }, [selected, camera])
  useEffect(() => {
    target.current = new Vector3(...HOME_POSITION)
  }, [reset])
  useEffect(() => {
    if (zoom)
      target.current = camera.position
        .clone()
        .normalize()
        .multiplyScalar(
          Math.max(
            MIN_CAMERA_DISTANCE,
            Math.min(
              MAX_CAMERA_DISTANCE,
              camera.position.length() - Math.sign(zoom) * 0.65,
            ),
          ),
        )
  }, [zoom, camera])
  useFrame((_, delta) => {
    if (!target.current) return
    // 指数平滑按秒衰减，正常帧率下近似与刷新率无关；钳制后台恢复的大 delta。
    const alpha = 1 - Math.exp(-Math.min(delta, MAX_FRAME_DELTA) * 4)
    const radius = camera.position.length()
    const nextRadius = radius + (target.current.length() - radius) * alpha
    direction.copy(target.current).normalize()
    // 仅对单位方向做四元数球面插值，再乘独立插值的半径。
    // 中间向量/四元数复用，避免 60fps 循环产生短命对象与 GC 抖动。
    camera.position.normalize()
    turn.setFromUnitVectors(camera.position, direction)
    step.identity().slerp(turn, alpha)
    camera.position.applyQuaternion(step).multiplyScalar(nextRadius)
    camera.lookAt(0, 0, 0)
    if (camera.position.distanceTo(target.current) < 0.005)
      target.current = null
  })
  // 原生 pointerdown 在拖动开始就取消目标；清理监听防止 StrictMode 重复注册。
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const stop = () => {
      target.current = null
      if (selected !== null) onSelect(null)
    }
    gl.domElement.addEventListener('pointerdown', stop)
    return () => gl.domElement.removeEventListener('pointerdown', stop)
  }, [gl, selected, onSelect])
  return null
}
