import { cities, EXPLORE_CITY_INDEX } from '../data/network.ts'
export const SPEED_OPTIONS = [0.5, 1, 2] as const
export type Speed = (typeof SPEED_OPTIONS)[number]
/** 最新用户意图在懒加载前也能保存；对象身份区分重复点击同一城市/复位。 */
export type CameraCommand =
  | { type: 'home' }
  | { type: 'focus'; index: number }
  | { type: 'zoom'; direction: 1 | -1 }
  | { type: 'idle' }
export interface ControlsState {
  // null 表示用户尚未操作，继续遵循操作系统的减少动态效果偏好。
  pausedOverride: boolean | null
  showRoutes: boolean
  speed: Speed
  selected: number | null
  cameraCommand: CameraCommand
}
export const initialControls: ControlsState = {
  pausedOverride: null,
  showRoutes: true,
  speed: 1,
  selected: null,
  cameraCommand: { type: 'home' },
}
type Action =
  | { type: 'select'; index: number | null }
  | { type: 'reset' }
  | { type: 'zoom'; direction: 1 | -1 }
  | { type: 'speed'; speed: Speed }
  | { type: 'toggle-routes' }
  | { type: 'toggle-playback'; paused: boolean }
  | { type: 'explore' }
/**
 * 纯状态机，不读取 DOM、不修改 Three.js 对象。组合动作在一次更新内完成，
 * 例如重置同时清除城市聚焦并发送相机复位命令，避免多个 Effect 相互同步。
 * 相机只有一个最新命令，避免 focus/reset/zoom 三个 Effect 在挂载时互相覆盖。
 */
export function controlsReducer(
  state: ControlsState,
  action: Action,
): ControlsState {
  switch (action.type) {
    case 'select':
      if (
        action.index !== null &&
        (!Number.isInteger(action.index) || !cities[action.index])
      )
        return state
      return {
        ...state,
        selected: action.index,
        cameraCommand:
          action.index === null
            ? { type: 'idle' }
            : { type: 'focus', index: action.index },
      }
    case 'reset':
      return { ...state, selected: null, cameraCommand: { type: 'home' } }
    case 'zoom':
      return {
        ...state,
        cameraCommand: { type: 'zoom', direction: action.direction },
      }
    case 'speed':
      return { ...state, speed: action.speed }
    case 'toggle-routes':
      return { ...state, showRoutes: !state.showRoutes }
    case 'toggle-playback':
      return {
        ...state,
        pausedOverride: !(state.pausedOverride ?? action.paused),
      }
    case 'explore':
      return {
        ...state,
        selected: EXPLORE_CITY_INDEX,
        pausedOverride: false,
        cameraCommand: { type: 'focus', index: EXPLORE_CITY_INDEX },
      }
  }
}
