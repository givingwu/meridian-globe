import { Suspense, lazy } from 'react'
import {
  ArrowRight,
  Globe2,
  Plus,
  Minus,
  RotateCcw,
  MousePointer2,
} from 'lucide-react'
import { SceneBoundary } from '../../components/SceneBoundary'
import { useGlobeControls } from './hooks/useGlobeControls'
import { CityPanel } from './components/CityPanel'
import { PlaybackControls } from './components/PlaybackControls'

// 必须在模块顶层声明 lazy：不能在 render 中重新创建组件类型，否则会重置整个 Canvas。
const Globe = lazy(() => import('./GlobeCanvas'))

/**
 * 地球功能的状态边界：弹窗和页脚变化不影响该状态，也不需要引入全局状态库。
 * Suspense 负责代码加载中，SceneBoundary 负责渲染异常，两种失败情况分开呈现。
 */
export function GlobeExperience() {
  const controls = useGlobeControls()
  const {
    paused,
    showRoutes,
    speed,
    selected,
    reset,
    zoom,
    setSelected,
    resetView,
    zoomIn,
    zoomOut,
    explore,
  } = controls
  return (
    <section className="experience" id="explore" aria-label="交互式地球演示">
      <div className="ambient" />
      <div className="topline">
        <span>
          <i /> AN EXPERIMENT IN CONNECTION
        </span>
        <span className="edition">WEBGL EXPLORATION / 001</span>
      </div>
      <div className="intro">
        <div className="eyebrow">ONE PLANET. ENDLESS POSSIBILITIES.</div>
        <h1>
          A world,
          <br />
          <em>connected.</em>
        </h1>
        <p>
          Across oceans. Beyond borders.
          <br />
          Every point is a place. Every arc, a possibility.
        </p>
        <p className="intro-cn">
          让每一次连接，跨越山海。
          <br />
          旋转地球，探索流动中的全球网络。
        </p>
        <button className="explore-button" onClick={explore}>
          Explore the connections <ArrowRight size={17} />
        </button>
        <div className="live-note">
          <span /> Illustrative network · No live transaction data
        </div>
      </div>
      <div className="globe-stage" aria-label="可拖拽旋转、滚轮缩放的三维地球">
        <SceneBoundary>
          <Suspense
            fallback={
              <div className="loading">
                <Globe2 size={34} />
                <span>Building a little world…</span>
              </div>
            }
          >
            <Globe
              paused={paused}
              showRoutes={showRoutes}
              speed={speed}
              selected={selected}
              reset={reset}
              zoom={zoom}
              onSelect={setSelected}
            />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="globe-caption">
        <span className="crosshair">+</span> EARTH / A NEW PERSPECTIVE{' '}
        <span className="caption-line" />
      </div>
      <div className="zoom-tools">
        <button onClick={zoomIn} aria-label="放大">
          <Plus size={17} />
        </button>
        <button onClick={zoomOut} aria-label="缩小">
          <Minus size={17} />
        </button>
        <span />
        <button onClick={resetView} aria-label="重置视角">
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="globe-hint">
        <MousePointer2 size={13} />
        <span>
          Drag to rotate <b>·</b> Scroll to zoom
        </span>
      </div>
      <CityPanel {...controls} />
      <PlaybackControls {...controls} />
    </section>
  )
}
