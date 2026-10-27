import { useCallback, useState } from 'react'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'
import { CraftSection } from '../components/CraftSection'
import { AboutDialog } from '../components/AboutDialog'
import { GlobeExperience } from '../features/globe/GlobeExperience'

/** 页面壳只拥有说明弹窗状态；地球交互状态留在功能内部，避免全局状态耦合。 */
export default function App() {
  const [about, setAbout] = useState(false)
  const openAbout = useCallback(() => setAbout(true), [])
  const closeAbout = useCallback(() => setAbout(false), [])
  return (
    <>
      <SiteHeader />
      <main>
        <GlobeExperience />
        <CraftSection onAbout={openAbout} />
      </main>
      <SiteFooter onAbout={openAbout} />
      {about && <AboutDialog onClose={closeAbout} />}
    </>
  )
}
