import { Pause, Play, RotateCcw } from 'lucide-react'
import { SPEED_OPTIONS } from '../state/controls'
import type { GlobeControls } from '../hooks/useGlobeControls'

/** 受控 DOM 面板：只读取状态并发出事件，避免与场景各自保存一套状态。 */
export function PlaybackControls({
  paused,
  togglePaused,
  showRoutes,
  toggleRoutes,
  speed,
  setSpeed,
  resetView,
}: Pick<
  GlobeControls,
  | 'paused'
  | 'togglePaused'
  | 'showRoutes'
  | 'toggleRoutes'
  | 'speed'
  | 'setSpeed'
  | 'resetView'
>) {
  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex h-[84px] items-center justify-between bg-[#0c1229a1] px-[34px] py-0 [backdrop-filter:blur(15px)] [border-top:1px_solid_#aeb4eb1a] compact:block compact:h-[130px] compact:px-[22px] compact:py-[17px]"
      data-ui="controlbar"
    >
      <div
        className="flex items-center gap-[12px] compact:gap-[10px]"
        data-ui="playback"
      >
        <button
          className="grid h-[36px] w-[36px] place-items-center rounded-[50%] bg-[#a4a3dc12] text-[#bbb4e9] [border:1px_solid_#c4b7ff24] compact:h-[30px] compact:w-[30px]"
          data-ui="play-button"
          onClick={togglePaused}
          aria-label={paused ? '播放动画' : '暂停动画'}
        >
          {paused ? (
            <Play size={15} fill="currentColor" />
          ) : (
            <Pause size={15} fill="currentColor" />
          )}
        </button>
        <span className="text-[11px] text-[#d3d8e8]">
          {paused ? 'Animation paused' : 'In constant motion'}
          <small className="mt-[4px] block text-[9px] text-[#68758e] compact:hidden">
            {paused
              ? 'Take a closer look'
              : 'A network that never stands still'}
          </small>
        </span>
      </div>
      <div
        className="flex items-center gap-[28px] text-[10px] text-[#a1abc2] compact:mt-[18px] compact:justify-between compact:gap-[10px] tablet:gap-[20px]"
        data-ui="control-options"
      >
        <button
          className="flex items-center gap-[9px] px-0 py-[8px] text-[10px] text-inherit [background:none]"
          data-ui="toggle-label"
          aria-pressed={showRoutes}
          onClick={toggleRoutes}
        >
          <span
            className="relative h-[15px] w-[26px] rounded-[20px] bg-[#35405a] [transition:background_0.2s] after:absolute after:top-[3px] after:left-[3px] after:h-[9px] after:w-[9px] after:rounded-[50%] after:bg-[#d1d6e5] after:[content:''] after:[transition:transform_0.2s] data-[active=true]:bg-[#796bc4] data-[active=true]:after:[transform:translateX(11px)] data-[active=true]:after:bg-[#ece7ff]"
            data-ui="toggle"
            data-active={showRoutes}
          />
          Connections
        </button>
        <div className="flex items-center gap-[4px]" data-ui="speed-control">
          <span className="mr-[8px] text-[#667490] compact:hidden">Speed</span>
          {SPEED_OPTIONS.map((value) => (
            <button
              key={value}
              aria-pressed={speed === value}
              className="rounded-[4px] bg-transparent px-[8px] py-[5px] text-[10px] text-[#7f8aa6] aria-pressed:bg-[#a9a1ff1b] aria-pressed:text-[#d5cfff]"
              onClick={() => setSpeed(value)}
            >
              {value}×
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-[7px] pl-[25px] text-[10px] text-[#9da9c5] [background:none] [border-left:1px_solid_#ffffff14] compact:pl-[12px]"
          data-ui="reset-button"
          onClick={resetView}
        >
          <RotateCcw size={14} />
          <span>Reset view</span>
        </button>
      </div>
    </div>
  )
}
