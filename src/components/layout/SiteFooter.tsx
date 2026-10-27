import { Globe2, Code2 } from 'lucide-react'

/** 通过事件回调请求打开说明，不自行保存重复的弹窗状态。 */
export function SiteFooter({ onAbout }: { onAbout: () => void }) {
  return (
    <footer>
      <span>
        <Globe2 size={14} /> MERIDIAN <b>—</b> A creative coding experiment
      </span>
      <span>Built with React, Three.js & a little curiosity.</span>
      <button onClick={onAbout}>
        <Code2 size={15} /> About this demo
      </button>
    </footer>
  )
}
