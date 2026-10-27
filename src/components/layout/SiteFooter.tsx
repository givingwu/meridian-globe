import { Globe2, Code2 } from 'lucide-react'

/** 通过事件回调请求打开说明，不自行保存重复的弹窗状态。 */
export function SiteFooter({ onAbout }: { onAbout: () => void }) {
  return (
    <footer className="mx-auto my-0 flex max-w-[1456px] items-center justify-between px-[32px] pt-[24px] pb-[30px] text-[9px] text-[#9297a6] [border-top:1px_solid_#e5e7ee] compact:mx-[28px] compact:flex-wrap compact:gap-[18px] compact:px-0 compact:pb-[24px]">
      <span className="flex items-center gap-[8px]">
        <Globe2 size={14} /> MERIDIAN{' '}
        <b className="mx-[4px] my-0 font-normal">—</b> A creative coding
        experiment
      </span>
      <span className="flex items-center gap-[8px] compact:hidden">
        Built with React, Three.js & a little curiosity.
      </span>
      <button
        className="flex items-center gap-[8px] text-[9px] text-[#7d8495] [background:none]"
        onClick={onAbout}
      >
        <Code2 size={15} /> About this demo
      </button>
    </footer>
  )
}
