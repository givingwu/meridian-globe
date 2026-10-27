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
    <div className="controlbar">
      <div className="playback">
        <button
          className="play-button"
          onClick={togglePaused}
          aria-label={paused ? '播放动画' : '暂停动画'}
        >
          {paused ? (
            <Play size={15} fill="currentColor" />
          ) : (
            <Pause size={15} fill="currentColor" />
          )}
        </button>
        <span>
          {paused ? 'Animation paused' : 'In constant motion'}
          <small>
            {paused
              ? 'Take a closer look'
              : 'A network that never stands still'}
          </small>
        </span>
      </div>
      <div className="control-options">
        <button
          className="toggle-label"
          aria-pressed={showRoutes}
          onClick={toggleRoutes}
        >
          <span className={`toggle ${showRoutes ? 'on' : ''}`} />
          Connections
        </button>
        <div className="speed-control">
          <span>Speed</span>
          {SPEED_OPTIONS.map((value) => (
            <button
              key={value}
              aria-pressed={speed === value}
              className={speed === value ? 'selected' : ''}
              onClick={() => setSpeed(value)}
            >
              {value}×
            </button>
          ))}
        </div>
        <button className="reset-button" onClick={resetView}>
          <RotateCcw size={14} />
          <span>Reset view</span>
        </button>
      </div>
    </div>
  )
}
