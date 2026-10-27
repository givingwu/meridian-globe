import { ArrowUpRight, Globe2, Github } from 'lucide-react'

/** 全站导航是纯展示组件；外链显式说明新窗口，防止用户失去演示上下文。 */
export function SiteHeader() {
  return (
    <header className="header">
      <a href="#" className="brand" aria-label="Meridian 首页">
        <Globe2 size={26} strokeWidth={1.5} />
        meridian<span className="brand-dot">®</span>
      </a>
      <nav>
        <a className="active" href="#explore">
          Globe explorer
        </a>
        <a href="#craft">
          Behind the globe <ArrowUpRight size={13} />
        </a>
      </nav>
      <a
        className="source-link"
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
