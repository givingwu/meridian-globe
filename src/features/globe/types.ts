import type { CameraCommand } from './state/controls'
/** DOM 控制面板与 WebGL 场景之间唯一的交互契约，不暴露 Three.js 对象。 */
export interface GlobeProps {
  paused: boolean
  showRoutes: boolean
  speed: number
  selected: number | null
  cameraCommand: CameraCommand
  onSelect: (index: number | null) => void
}

/** 动画只接收有效的播放状态和倍速，不持有全局 UI 状态。 */
export type AnimationProps = Pick<GlobeProps, 'paused' | 'speed'>
