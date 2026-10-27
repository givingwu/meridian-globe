import { useCallback, useReducer } from 'react'
import { useReducedMotion } from '../../../hooks/useBrowserPreferences'
import { controlsReducer, initialControls } from '../state/controls'
import type { Speed } from '../state/controls'

/**
 * DOM 控件与 Canvas 共用的唯一状态入口。只保存用户意图，不保存每帧位置。
 * paused 是派生值，无需用 Effect 再复制一份；用户操作后以显式选择为准。
 * 稳定的事件回调让相机 Effect 只响应真实的命令/选中城市变化。
 */
export function useGlobeControls() {
  const [state, dispatch] = useReducer(controlsReducer, initialControls)
  const reducedMotion = useReducedMotion()
  const paused = state.pausedOverride ?? reducedMotion
  const setSelected = useCallback(
    (index: number | null) => dispatch({ type: 'select', index }),
    [],
  )
  const resetView = useCallback(() => dispatch({ type: 'reset' }), [])
  const zoomIn = useCallback(() => dispatch({ type: 'zoom', direction: 1 }), [])
  const zoomOut = useCallback(
    () => dispatch({ type: 'zoom', direction: -1 }),
    [],
  )
  const setSpeed = useCallback(
    (speed: Speed) => dispatch({ type: 'speed', speed }),
    [],
  )
  const toggleRoutes = useCallback(
    () => dispatch({ type: 'toggle-routes' }),
    [],
  )
  const togglePaused = useCallback(
    () => dispatch({ type: 'toggle-playback', paused }),
    [paused],
  )
  const explore = useCallback(() => dispatch({ type: 'explore' }), [])
  return {
    ...state,
    paused,
    setSelected,
    resetView,
    zoomIn,
    zoomOut,
    setSpeed,
    toggleRoutes,
    togglePaused,
    explore,
  }
}
export type GlobeControls = ReturnType<typeof useGlobeControls>
