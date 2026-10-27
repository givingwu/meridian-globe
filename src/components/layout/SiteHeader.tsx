import { ArrowUpRight, Globe2, Github } from 'lucide-react'

/** 全站导航是纯展示组件；外链显式说明新窗口，防止用户失去演示上下文。 */
export function SiteHeader() {
  return (
    <header
      className="m-auto flex h-[94px] max-w-[1512px] items-center justify-between px-[58px] py-0 compact:h-[75px] compact:px-[22px] tablet:px-[32px]"
      data-ui="header"
    >
      <a
        href="#"
        className="flex items-center gap-[9px] font-display text-[25px] font-extrabold tracking-[-1.2px] compact:text-[22px]"
        data-ui="brand"
        aria-label="Meridian 首页"
      >
        <Globe2 className="text-[#6559c9]" size={26} strokeWidth={1.5} />
        meridian
        <span
          className="mt-[6px] mr-0 mb-0 ml-[-3px] self-start [font:10px_'DM_Sans',_sans-serif]"
          data-ui="brand-dot"
        >
          ®
        </span>
      </a>
      <nav className="flex items-center gap-[35px] text-[13px] text-[#7b8190] compact:hidden">
        <a
          className="flex items-center gap-[6px] text-[#242a3b]"
          data-ui="active"
          href="#explore"
        >
          Globe explorer
        </a>
        <a className="flex items-center gap-[6px]" href="#craft">
          Behind the globe <ArrowUpRight size={13} />
        </a>
      </nav>
      <a
        className="flex items-center gap-[10px] rounded-[6px] bg-[#fff] px-[15px] py-[11px] text-[12px] [border:1px_solid_#dddfe7] compact:px-[10px] compact:py-[8px] compact:text-[10px]"
        data-ui="source-link"
        href="https://github.com/givingwu/meridian-globe"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="在 GitHub 查看 Meridian Globe 源码（新窗口）"
      >
        <Github size={16} aria-hidden="true" />
        GitHub <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </header>
  )
}
