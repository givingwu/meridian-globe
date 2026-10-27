import { MoveUpRight, Radio } from 'lucide-react'
import { cities } from '../data/network'
import type { GlobeControls } from '../hooks/useGlobeControls'

/** 受控 DOM 面板：只读取状态并发出事件，避免与场景各自保存一套状态。 */
export function CityPanel({
  selected,
  setSelected,
  resetView,
}: Pick<GlobeControls, 'selected' | 'setSelected' | 'resetView'>) {
  return (
    <div className="city-panel">
      <span className="panel-label">
        <Radio size={12} />{' '}
        {selected === null ? 'GLOBAL PERSPECTIVE' : 'LOCATION IN FOCUS'}
      </span>
      <div className="city-title">
        {selected === null ? 'Connected, everywhere.' : cities[selected].name}
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
  )
}
