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
    cameraCommand,
    setSelected,
    resetView,
    zoomIn,
    zoomOut,
    explore,
  } = controls
  return (
    <section
      className="relative isolate h-[min(790px,_calc(100svh_-_110px))] min-h-[740px] overflow-hidden rounded-[14px] bg-night text-white [box-shadow:0_15px_40px_#17224a0a] compact:h-[1000px] compact:min-h-0 compact:rounded-[12px] tablet:min-h-[710px] wide:h-[800px]"
      data-ui="experience"
      id="explore"
      aria-label="交互式地球演示"
    >
      <div
        className="absolute inset-0 [z-index:-1] [background-image:radial-gradient(ellipse_at_70%_50%,_#24225744,_transparent_57%),_radial-gradient(ellipse_at_15%_100%,_#183b481f,_transparent_45%)]"
        data-ui="ambient"
      />
      <div
        className="absolute top-[28px] right-[32px] left-[32px] [z-index:2] flex justify-between text-[9px] tracking-[1.9px] text-[#a0a6bc] compact:top-[22px] compact:right-[22px] compact:left-[22px] compact:text-[7px] compact:tracking-[1.3px]"
        data-ui="topline"
      >
        <span className="flex items-center gap-[9px]">
          <i className="h-[5px] w-[5px] rounded-[100%] bg-[#a492ff] [box-shadow:0_0_12px_#b29aff]" />{' '}
          AN EXPERIMENT IN CONNECTION
        </span>
        <span className="text-[#717b94] compact:hidden" data-ui="edition">
          WEBGL EXPLORATION / 001
        </span>
      </div>
      <div
        className="pointer-events-none absolute top-[21%] left-[5%] [z-index:2] compact:top-[75px] compact:left-[26px] tablet:top-[23%] tablet:left-[4%] wide:top-[22%]"
        data-ui="intro"
      >
        <div
          className="text-[9px] font-[650] tracking-[1.8px] text-[#8982bc] compact:text-[8px]"
          data-ui="eyebrow"
        >
          ONE PLANET. ENDLESS POSSIBILITIES.
        </div>
        <h1 className="mx-0 my-[24px] font-display text-[clamp(48px,_5.5vw,_84px)] leading-[1.1] font-medium tracking-[-4px] compact:my-[18px] compact:text-[58px] compact:tracking-[-3px] tablet:text-[62px]">
          A world,
          <br />
          <em className="[background-image:linear-gradient(100deg,_#bdb0ff_5%,_#8d9fea_65%,_#7dc3d3)] [background-clip:text] text-transparent not-italic [-webkit-background-clip:text]">
            connected.
          </em>
        </h1>
        <p className="mx-0 my-[22px] text-[14px] leading-[1.9] tracking-[0.1px] text-[#a0a8bd] compact:my-[12px] compact:text-[12px] tablet:text-[12px]">
          Across oceans. Beyond borders.
          <br />
          Every point is a place. Every arc, a possibility.
        </p>
        <p
          className="mx-0 mt-[18px] mb-[22px] text-[12px] leading-[1.9] tracking-[0.1px] text-[#717e9c] compact:mb-[12px] compact:hidden"
          data-ui="intro-cn"
        >
          让每一次连接，跨越山海。
          <br />
          旋转地球，探索流动中的全球网络。
        </p>
        <button
          className="pointer-events-auto mt-[28px] flex items-center gap-[24px] rounded-[5px] bg-[#e3dfff] px-[18px] py-[14px] text-[12px] font-semibold text-[#292447] [border:1px_solid_#eeeaff] [transition:background_0.2s,_transform_0.2s] hover:[transform:translateY(-2px)] hover:bg-[#fff] compact:mt-[20px] compact:px-[15px] compact:py-[12px] compact:text-[11px]"
          data-ui="explore-button"
          onClick={explore}
        >
          Explore the connections <ArrowRight size={17} />
        </button>
        <div
          className="mt-[18px] flex items-center gap-[7px] text-[9px] text-[#62708c] compact:mt-[12px] compact:text-[8px]"
          data-ui="live-note"
        >
          <span className="h-[4px] w-[4px] rounded-[100%] bg-[#7f8eac]" />{' '}
          Illustrative network · No live transaction data
        </div>
      </div>
      <div
        className="absolute top-[1%] right-[-3%] bottom-[9%] left-[30%] cursor-grab [touch-action:none] active:cursor-grabbing compact:top-[340px] compact:right-[-20%] compact:bottom-[165px] compact:left-[-20%] tablet:right-[-14%] tablet:left-[25%] wide:right-[-1%] wide:left-[32%]"
        data-ui="globe-stage"
        aria-label="可拖拽旋转、滚轮缩放的三维地球"
      >
        <SceneBoundary>
          <Suspense
            fallback={
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] text-[13px] text-[#a69bcf]"
                data-ui="loading"
              >
                <Globe2
                  className="animate-spin [animation-duration:6s]"
                  size={34}
                />
                <span>Building a little world…</span>
              </div>
            }
          >
            <Globe
              paused={paused}
              showRoutes={showRoutes}
              speed={speed}
              selected={selected}
              cameraCommand={cameraCommand}
              onSelect={setSelected}
            />
          </Suspense>
        </SceneBoundary>
      </div>
      <div
        className="pointer-events-none absolute top-[12%] left-[49%] flex items-center gap-[10px] [font-family:monospace] text-[8px] tracking-[1.5px] text-[#6d7792] compact:top-[410px] compact:left-[24px] compact:text-[7px] compact:tracking-[0.8px] compact:opacity-[0.7] tablet:left-[48%]"
        data-ui="globe-caption"
      >
        <span className="text-[17px] text-[#8d87af]" data-ui="crosshair">
          +
        </span>{' '}
        EARTH / A NEW PERSPECTIVE{' '}
        <span
          className="h-[1px] w-[45px] bg-[#3e425e] compact:w-[20px]"
          data-ui="caption-line"
        />
      </div>
      <div
        className="absolute top-[39%] right-[26px] flex flex-col rounded-[7px] bg-[#131b3066] p-[4px] [border:1px_solid_#c4c8ff1c] compact:top-[520px] compact:right-[15px]"
        data-ui="zoom-tools"
      >
        <button
          className="grid h-[36px] w-[32px] place-items-center bg-transparent text-[#9ca7c3] hover:bg-[#ffffff0a] hover:text-white"
          onClick={zoomIn}
          aria-label="放大"
        >
          <Plus size={17} />
        </button>
        <button
          className="grid h-[36px] w-[32px] place-items-center bg-transparent text-[#9ca7c3] hover:bg-[#ffffff0a] hover:text-white"
          onClick={zoomOut}
          aria-label="缩小"
        >
          <Minus size={17} />
        </button>
        <span className="m-[4px] h-[1px] bg-[#ffffff12]" />
        <button
          className="grid h-[36px] w-[32px] place-items-center bg-transparent text-[#9ca7c3] hover:bg-[#ffffff0a] hover:text-white"
          onClick={resetView}
          aria-label="重置视角"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div
        className="pointer-events-none absolute bottom-[114px] left-[55%] flex items-center gap-[9px] text-[10px] text-[#77819b] compact:bottom-[161px] compact:left-[25px] compact:text-[9px] tablet:bottom-[120px] tablet:left-[48%]"
        data-ui="globe-hint"
      >
        <MousePointer2 size={13} />
        <span>
          {'Drag to rotate '}
          <b className="mx-[8px] my-0 font-normal text-[#49546f]">·</b>
          {' Scroll to zoom'}
        </span>
      </div>
      <CityPanel {...controls} />
      <PlaybackControls {...controls} />
    </section>
  )
}
