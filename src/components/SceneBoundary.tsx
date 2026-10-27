import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

/** React 错误边界目前使用类生命周期；隔离 WebGL 异常，让页面导航和说明仍可使用。 */
export class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Globe rendering failed', error, info.componentStack)
  }
  render() {
    return this.state.failed ? (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] text-[13px] text-[#a69bcf]"
        data-ui="fallback"
      >
        地球加载失败，请刷新页面并确认浏览器已开启硬件加速。
      </div>
    ) : (
      this.props.children
    )
  }
}
