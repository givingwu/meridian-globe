import { useSyncExternalStore } from 'react'

// 浏览器是这些状态的唯一来源。订阅函数放在模块级，避免每次 render 取消并重建监听。
// React 会在订阅后再次读取快照，覆盖首次 render 与监听建立之间发生的变化。
const visibleSnapshot = () => !document.hidden
const serverVisible = () => true
function subscribeVisibility(notify: () => void) {
  document.addEventListener('visibilitychange', notify)
  return () => document.removeEventListener('visibilitychange', notify)
}
const motionQuery = '(prefers-reduced-motion: reduce)'
const motionSnapshot = () => window.matchMedia(motionQuery).matches
const serverMotion = () => false
function subscribeMotion(notify: () => void) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
/** 隐藏标签页停止 WebGL 帧循环；恢复时由场景钳制 delta，避免动画突然跳跃。 */
export const usePageVisibility = () =>
  useSyncExternalStore(subscribeVisibility, visibleSnapshot, serverVisible)
/** 只提供系统偏好；用户主动播放/暂停的选择由功能状态覆盖。 */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotion)
