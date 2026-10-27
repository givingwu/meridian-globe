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
    <div
      className="absolute right-[33px] bottom-[124px] w-[218px] pl-[17px] [border-left:1px_solid_#a6a0ff30] compact:right-[22px] compact:bottom-[158px] compact:w-[160px] tablet:right-[25px] tablet:bottom-[110px] tablet:w-[180px] wide:bottom-[135px]"
      data-ui="city-panel"
    >
      <span
        className="flex items-center gap-[6px] text-[8px] tracking-[1.1px] text-[#9189ba] compact:text-[6px] compact:tracking-[0.8px]"
        data-ui="panel-label"
      >
        <Radio size={12} />{' '}
        {selected === null ? 'GLOBAL PERSPECTIVE' : 'LOCATION IN FOCUS'}
      </span>
      <div
        className="mx-0 mt-[12px] mb-[15px] flex items-center justify-between gap-[8px] text-[12px] text-[#d1d5e5] compact:my-[8px] compact:text-[10px]"
        data-ui="city-title"
      >
        {selected === null ? 'Connected, everywhere.' : cities[selected].name}
        <MoveUpRight className="text-[#777a98]" size={18} />
      </div>
      <label className="block text-[9px] text-[#6e7b99]" data-ui="city-select">
        <span className="mb-[7px] block compact:hidden">Jump to a city</span>
        <select
          className="w-full cursor-pointer rounded-[4px] bg-[#10172e] px-[9px] py-[7px] text-[11px] text-[#aeb7cc] [border:1px_solid_#a7adcf25] compact:text-[10px]"
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
