import { Quaternion, Vector3 } from 'three'
import { cities } from '../data/network.ts'
import {
  HOME_POSITION,
  MIN_CAMERA_DISTANCE,
  MAX_CAMERA_DISTANCE,
  MAX_FRAME_DELTA,
} from '../config.ts'
import { toPosition } from './coordinates.ts'
import type { CameraCommand } from '../state/controls.ts'

/**
 * 不依赖 React/DOM 的相机过渡器。每个挂载场景独占一个实例，只有命令到达时分配目标。
 * 帧循环复用四元数和方向向量，不分配临时对象；方向球面插值与半径插值分开，
 * 保留原有 4/s 指数平滑速度，同时避免直线穿球。无 GPU 资源，无需 dispose。
 */
export class CameraTransition {
  private target: Vector3 | null = null
  private lastCommand: CameraCommand | null = null
  private turn = new Quaternion()
  private step = new Quaternion()
  private direction = new Vector3()
  get active() {
    return this.target !== null
  }
  cancel() {
    this.target = null
  }
  reset() {
    this.cancel()
    this.lastCommand = null
  }
  apply(command: CameraCommand, position: Vector3) {
    // StrictMode 重放同一个 Effect 时不能把缩放再执行一次；重复用户点击是新对象。
    if (command === this.lastCommand) return
    this.lastCommand = command
    switch (command.type) {
      case 'idle':
        this.cancel()
        break
      case 'home':
        this.target = new Vector3(...HOME_POSITION)
        break
      case 'focus':
        this.target = toPosition(
          cities[command.index].lat,
          cities[command.index].lon,
          (this.target ?? position).length(),
        )
        break
      case 'zoom': {
        // 在既有目标上累加，快速连击不会丢步；聚焦途中缩放也不丢失城市方向。
        const target = (this.target ?? position).clone()
        const radius = Math.max(
          MIN_CAMERA_DISTANCE,
          Math.min(
            MAX_CAMERA_DISTANCE,
            target.length() - command.direction * 0.65,
          ),
        )
        this.target = target.normalize().multiplyScalar(radius)
        break
      }
    }
  }
  advance(position: Vector3, delta: number) {
    if (!this.target) return
    const alpha = 1 - Math.exp(-Math.min(delta, MAX_FRAME_DELTA) * 4)
    const radius = position.length()
    const nextRadius = radius + (this.target.length() - radius) * alpha
    this.direction.copy(this.target).normalize()
    position.normalize()
    this.turn.setFromUnitVectors(position, this.direction)
    this.step.identity().slerp(this.turn, alpha)
    position.applyQuaternion(this.step).multiplyScalar(nextRadius)
    // 明确收敛到目标再释放控制权，防止自动旋转不断将镜头推离停止阈值。
    if (position.distanceTo(this.target) < 0.005) {
      position.copy(this.target)
      this.target = null
    }
  }
}
