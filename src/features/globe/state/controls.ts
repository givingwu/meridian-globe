import { cities, EXPLORE_CITY_INDEX } from '../data/network.ts'
export const SPEED_OPTIONS = [0.5, 1, 2] as const
export type Speed = (typeof SPEED_OPTIONS)[number]
export interface ControlsState {
  // null 表示用户尚未操作，继续遵循操作系统的减少动态效果偏好。
  pausedOverride: boolean | null
  showRoutes: boolean
  speed: Speed
  selected: number | null
  // 相机命令使用递增序号：连续点击同一按钮仍然产生新的命令。
  reset: number
  zoom: number
}
export const initialControls: ControlsState = {
  pausedOverride: null,
  showRoutes: true,
  speed: 1,
  selected: null,
  reset: 0,
  zoom: 0,
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
 * zoom 的符号代表方向，绝对值代表序号；0 保留为「没有缩放命令」。
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
      return { ...state, selected: action.index }
    case 'reset':
      return { ...state, selected: null, reset: state.reset + 1, zoom: 0 }
    case 'zoom':
      return { ...state, zoom: action.direction * (Math.abs(state.zoom) + 1) }
    case 'speed':
      return { ...state, speed: action.speed }
    case 'toggle-routes':
      return { ...state, showRoutes: !state.showRoutes }
    case 'toggle-playback':
      return { ...state, pausedOverride: !action.paused }
    case 'explore':
      return { ...state, selected: EXPLORE_CITY_INDEX, pausedOverride: false }
  }
}
