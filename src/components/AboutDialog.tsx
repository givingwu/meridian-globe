import { useEffect, useRef } from 'react'
import { X, ArrowUpRight } from 'lucide-react'

/** 原生 modal dialog 管理焦点陷阱和 Escape；Effect 仅同步浏览器命令式 API。 */
export function AboutDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    // StrictMode 会执行 setup → cleanup → setup；关闭和还原均可重复执行。
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className="about-dialog"
      aria-labelledby="about-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="modal">
        <button
          autoFocus
          className="modal-close"
          aria-label="关闭说明"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <span className="eyebrow">BEHIND THE GLOBE</span>
        <h2 id="about-title">A world built in layers.</h2>
        <p>
          基于 Stripe《To design and develop an interactive
          globe》的独立实现，非 Stripe 官方产品。
        </p>
        <ol>
          <li>
            <strong>海洋球体</strong> — 自定义 GLSL 渐变与边缘大气光。
          </li>
          <li>
            <strong>陆地点阵</strong> — 68,000 个 Fibonacci 球面采样点，用
            Natural Earth 陆地轮廓筛选；GPU shader 驱动闪烁。
          </li>
          <li>
            <strong>连接弧线</strong> — 球面插值、抬升曲线、流动光迹和城市脉冲。
          </li>
        </ol>
        <p>
          React 19 · TypeScript strict · Vite · React Three Fiber ·
          Three.js。所有航线均为演示数据，支持减少动态效果偏好与后台标签页停帧。
        </p>
        <a
          href="https://stripe.com/blog/globe"
          target="_blank"
          rel="noreferrer"
        >
          阅读原文 <ArrowUpRight size={15} />
        </a>
      </section>
    </dialog>
  )
}
