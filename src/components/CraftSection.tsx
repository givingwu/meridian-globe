import { ArrowUpRight, Globe2, MoveUpRight, Layers3 } from 'lucide-react'
import { routes } from '../features/globe/data/network'

/** 路线数量由唯一的数据源派生，不在组件中维护一份容易失步的计数。 */
export function CraftSection({ onAbout }: { onAbout: () => void }) {
  return (
    <section className="under-globe" id="craft">
      <div className="section-heading">
        <span className="eyebrow">SMALL DETAILS. A WHOLE WORLD.</span>
        <h2>The craft behind the connection.</h2>
        <button onClick={onAbout}>
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
  )
}
