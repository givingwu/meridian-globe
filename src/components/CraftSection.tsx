import type { ReactNode } from 'react'
import { ArrowUpRight, Globe2, MoveUpRight, Layers3 } from 'lucide-react'
import { routes } from '../features/globe/data/network'

/** 路线数量由唯一的数据源派生，不在组件中维护一份容易失步的计数。 */
export function CraftSection({ onAbout }: { onAbout: () => void }) {
  return (
    <section
      className="px-[32px] pt-[47px] pb-[35px] compact:px-[16px] compact:pt-[35px] compact:pb-[25px]"
      data-ui="under-globe"
      id="craft"
    >
      <div className="relative" data-ui="section-heading">
        <span
          className="text-[8px] font-[650] tracking-[1.8px] text-[#868492]"
          data-ui="eyebrow"
        >
          SMALL DETAILS. A WHOLE WORLD.
        </span>
        <h2 className="mx-0 mt-[12px] mb-[30px] font-display text-[23px] font-semibold tracking-[-0.8px] compact:mb-[20px] compact:text-[21px]">
          The craft behind the connection.
        </h2>
        <button
          className="absolute right-0 bottom-[6px] flex items-center gap-[9px] bg-transparent text-[11px] text-[#6d7083] compact:static compact:mb-[25px] compact:p-0"
          onClick={onAbout}
        >
          Inside the experiment <ArrowUpRight size={15} />
        </button>
      </div>
      <div
        className="grid grid-cols-3 gap-[36px] compact:grid-cols-1 compact:gap-[20px] tablet:gap-[22px]"
        data-ui="facts"
      >
        <FactCard
          icon={<Globe2 size={21} />}
          value="68,000"
          title="Points of possibility"
          index="01"
        >
          球面均匀采样，真实海岸线勾勒陆地点阵。
        </FactCard>
        <FactCard
          icon={<MoveUpRight size={21} />}
          value={
            <>
              {routes.length}
              <span className="text-[17px] tracking-[-0.3px] text-[#858799]">
                {' routes'}
              </span>
            </>
          }
          title="Distance becomes connection"
          index="02"
        >
          沿球面升起的弧线，传递持续流动的光。
        </FactCard>
        <FactCard
          icon={<Layers3 size={21} />}
          value={
            <>
              3
              <span className="text-[17px] tracking-[-0.3px] text-[#858799]">
                {' layers'}
              </span>
            </>
          }
          title="A little depth. A lot of life."
          index="03"
        >
          海洋、闪烁点阵与弧线，组成一颗有生命的地球。
        </FactCard>
      </div>
    </section>
  )
}

/** 重复卡片复用组件结构与 utilities，不建立隐藏在全局 CSS 中的样式类。 */
function FactCard({
  icon,
  value,
  title,
  index,
  children,
}: {
  icon: ReactNode
  value: ReactNode
  title: string
  index: string
  children: ReactNode
}) {
  return (
    <article className="relative flex gap-[20px] pt-[20px] pr-[15px] pb-[8px] pl-0 [border-top:1px_solid_#e0e3eb] compact:gap-[22px] compact:pt-[21px] compact:pr-0 compact:pb-[5px] tablet:gap-[12px]">
      <span className="mt-[8px] text-[#8581ac]" data-ui="fact-icon">
        {icon}
      </span>
      <div>
        <strong className="font-display text-[30px] font-medium tracking-[-1px] compact:text-[28px]">
          {value}
        </strong>
        <h3 className="mx-0 mt-[11px] mb-[8px] text-[11px] font-[550] compact:my-[7px]">
          {title}
        </h3>
        <p className="m-0 text-[10px] leading-[1.8] text-[#9296a4] compact:max-w-[none] tablet:max-w-[190px]">
          {children}
        </p>
      </div>
      <span
        className="absolute top-[28px] right-0 [font-family:monospace] text-[9px] text-[#b1b4bf] compact:top-[30px]"
        data-ui="fact-index"
      >
        {index}
      </span>
    </article>
  )
}
