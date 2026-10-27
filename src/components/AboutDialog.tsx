import { useEffect, useRef } from 'react'
import { X, ArrowUpRight } from 'lucide-react'

/** 原生 modal dialog 管理焦点陷阱和 Escape；Effect 仅同步浏览器命令式 API。 */
export function AboutDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    // 不使用 React autoFocus：它会在 Effect 前抢焦点，导致 previousFocus 变成关闭按钮。
    // showModal 原生聚焦首个可聚焦元素，清理时可恢复真正的触发按钮。
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
      className="max-h-[100dvh] max-w-[100vw] bg-transparent p-[24px] text-inherit [border:0] backdrop:[backdrop-filter:blur(9px)] backdrop:[background:rgba(4,_9,_25,_0.75)]"
      data-ui="about-dialog"
      aria-labelledby="about-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="relative max-w-[580px] rounded-[15px] bg-paper p-[42px] text-[#454b60] [box-shadow:0_30px_120px_#0004] compact:px-[25px] compact:py-[32px]"
        data-ui="modal"
      >
        <button
          className="absolute top-[18px] right-[18px] text-[#73788d] [background:none]"
          data-ui="modal-close"
          aria-label="关闭说明"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <span
          className="text-[9px] font-[650] tracking-[1.8px] text-[#8982bc]"
          data-ui="eyebrow"
        >
          BEHIND THE GLOBE
        </span>
        <h2
          className="font-display text-[30px] tracking-[-1px] text-[#1c2540] compact:text-[25px]"
          id="about-title"
        >
          A world built in layers.
        </h2>
        <p className="text-[12px] leading-[2]">
          基于 Stripe《To design and develop an interactive
          globe》的独立实现，非 Stripe 官方产品。
        </p>
        <ol className="mx-0 my-[24px] pl-[18px]">
          <li className="px-0 py-[6px] text-[12px] leading-[2]">
            <strong>海洋球体</strong> — 自定义 GLSL 渐变与边缘大气光。
          </li>
          <li className="px-0 py-[6px] text-[12px] leading-[2]">
            <strong>陆地点阵</strong> — 68,000 个 Fibonacci 球面采样点，用
            Natural Earth 陆地轮廓筛选；GPU shader 驱动闪烁。
          </li>
          <li className="px-0 py-[6px] text-[12px] leading-[2]">
            <strong>连接弧线</strong> — 球面插值、抬升曲线、流动光迹和城市脉冲。
          </li>
        </ol>
        <p className="text-[12px] leading-[2]">
          React 19 · TypeScript strict · Vite · React Three Fiber ·
          Three.js。所有航线均为演示数据，支持减少动态效果偏好与后台标签页停帧。
        </p>
        <a
          className="mt-[22px] flex items-center gap-[8px] text-[12px] text-[#7465be]"
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
