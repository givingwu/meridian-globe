import { Component, Suspense, lazy, useEffect, useState } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import {
  ArrowUpRight,
  ArrowRight,
  Globe2,
  Pause,
  Play,
  Plus,
  Minus,
  RotateCcw,
  MoveUpRight,
  Layers3,
  MousePointer2,
  Radio,
  X,
  Code2,
} from 'lucide-react'
import { cities, routes } from './data'
const Globe = lazy(() => import('./Globe'))
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Globe rendering failed', error, info.componentStack)
  }
  render() {
    return this.state.failed ? (
      <div className="fallback">
        地球加载失败，请刷新页面并确认浏览器已开启硬件加速。
      </div>
    ) : (
      this.props.children
    )
  }
}
export default function App() {
  const [paused, setPaused] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [showRoutes, setShowRoutes] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [reset, setReset] = useState(0)
  const [zoom, setZoom] = useState(0)
  const [about, setAbout] = useState(false)
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbout(false)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
  const resetView = () => {
    setSelected(null)
    setReset((n) => n + 1)
  }
  return (
    <>
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
          href="https://stripe.com/blog/globe"
          target="_blank"
          rel="noreferrer"
        >
          Inspired by Stripe <ArrowUpRight size={14} />
        </a>
      </header>
      <main>
        <section
          className="experience"
          id="explore"
          aria-label="交互式地球演示"
        >
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
            <button
              className="explore-button"
              onClick={() => {
                setSelected(12)
                setPaused(false)
              }}
            >
              Explore the connections <ArrowRight size={17} />
            </button>
            <div className="live-note">
              <span /> Illustrative network · No live transaction data
            </div>
          </div>
          <div
            className="globe-stage"
            aria-label="可拖拽旋转、滚轮缩放的三维地球"
          >
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
            <button
              onClick={() => setZoom((v) => Math.abs(v) + 1)}
              aria-label="放大"
            >
              <Plus size={17} />
            </button>
            <button
              onClick={() => setZoom((v) => -(Math.abs(v) + 1))}
              aria-label="缩小"
            >
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
          <div className="city-panel">
            <span className="panel-label">
              <Radio size={12} />{' '}
              {selected === null ? 'GLOBAL PERSPECTIVE' : 'LOCATION IN FOCUS'}
            </span>
            <div className="city-title">
              {selected === null
                ? 'Connected, everywhere.'
                : cities[selected].name}
              <MoveUpRight size={18} />
            </div>
            <label className="city-select">
              <span>Jump to a city</span>
              <select
                aria-label="选择聚焦城市"
                value={selected ?? ''}
                onChange={(e) =>
                  e.target.value === ''
                    ? resetView()
                    : setSelected(Number(e.target.value))
                }
              >
                <option value="">World view</option>
                {cities.map((city, index) => (
                  <option key={city.code} value={index}>
                    {city.name} · {city.code}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="controlbar">
            <div className="playback">
              <button
                className="play-button"
                onClick={() => setPaused((v) => !v)}
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
                onClick={() => setShowRoutes((v) => !v)}
              >
                <span className={`toggle ${showRoutes ? 'on' : ''}`} />
                Connections
              </button>
              <div className="speed-control">
                <span>Speed</span>
                {[0.5, 1, 2].map((value) => (
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
        </section>
        <section className="under-globe" id="craft">
          <div className="section-heading">
            <span className="eyebrow">SMALL DETAILS. A WHOLE WORLD.</span>
            <h2>The craft behind the connection.</h2>
            <button onClick={() => setAbout(true)}>
              Inside the experiment <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="facts">
            <article>
              <span className="fact-icon">
                <Globe2 size={21} />
              </span>
              <div>
                <strong>68,000</strong>
                <h3>Points of possibility</h3>
                <p>球面均匀采样，真实海岸线勾勒陆地点阵。</p>
              </div>
              <span className="fact-index">01</span>
            </article>
            <article>
              <span className="fact-icon">
                <MoveUpRight size={21} />
              </span>
              <div>
                <strong>
                  {routes.length}
                  <span> routes</span>
                </strong>
                <h3>Distance becomes connection</h3>
                <p>沿球面升起的弧线，传递持续流动的光。</p>
              </div>
              <span className="fact-index">02</span>
            </article>
            <article>
              <span className="fact-icon">
                <Layers3 size={21} />
              </span>
              <div>
                <strong>
                  3<span> layers</span>
                </strong>
                <h3>A little depth. A lot of life.</h3>
                <p>海洋、闪烁点阵与弧线，组成一颗有生命的地球。</p>
              </div>
              <span className="fact-index">03</span>
            </article>
          </div>
        </section>
      </main>
      <footer>
        <span>
          <Globe2 size={14} /> MERIDIAN <b>—</b> A creative coding experiment
        </span>
        <span>Built with React, Three.js & a little curiosity.</span>
        <button onClick={() => setAbout(true)}>
          <Code2 size={15} /> About this demo
        </button>
      </footer>
      {about && (
        <div className="modal-backdrop" onClick={() => setAbout(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key !== 'Tab') return
              const items =
                e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')
              const first = items[0],
                last = items[items.length - 1]
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
              }
            }}
          >
            <button
              autoFocus
              className="modal-close"
              aria-label="关闭说明"
              onClick={() => setAbout(false)}
            >
              <X size={20} />
            </button>
            <span className="eyebrow">BEHIND THE GLOBE</span>
            <h2 id="about-title">A world built in layers.</h2>
            <p>
              基于 Stripe《To design and develop an interactive
              globe》的独立实现，非 Stripe 官方产品。
            </p>
            <ol>
              <li>
                <strong>海洋球体</strong> — 自定义 GLSL 渐变与边缘大气光。
              </li>
              <li>
                <strong>陆地点阵</strong> — 68,000 个 Fibonacci 球面采样点，用
                Natural Earth 陆地轮廓筛选；GPU shader 驱动闪烁。
              </li>
              <li>
                <strong>连接弧线</strong> —
                球面插值、抬升曲线、流动光迹和城市脉冲。
              </li>
            </ol>
            <p>
              React 19 · TypeScript strict · Vite · React Three Fiber ·
              Three.js。所有航线均为演示数据，支持减少动态效果偏好与后台标签页停帧。
            </p>
            <a
              href="https://stripe.com/blog/globe"
              target="_blank"
              rel="noreferrer"
            >
              阅读原文 <ArrowUpRight size={15} />
            </a>
          </section>
        </div>
      )}
    </>
  )
}
