import { OrbitControls } from '@react-three/drei'
import { cities, routes } from '../data/network'
import type { GlobeProps } from '../types'
import { MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE } from '../config'
import { Land } from './Land'
import { Route } from './Route'
import { CityMarker } from './CityMarker'
import { CameraMotion } from './CameraMotion'
import { Ocean } from './Ocean'

/** 只编排场景层与控制器，材质/时间/几何分别由各子组件拥有。稳定 key 不依赖列表位置。 */
export function GlobeScene(props: GlobeProps) {
  return (
    <>
      <Ocean paused={props.paused} speed={props.speed} />
      <Land paused={props.paused} speed={props.speed} />
      {props.showRoutes &&
        routes.map((pair, index) => (
          <Route
            key={`${cities[pair[0]].code}-${cities[pair[1]].code}`}
            pair={pair}
            index={index}
            paused={props.paused}
            speed={props.speed}
          />
        ))}
      {cities.map((_, index) => (
        <CityMarker key={cities[index].code} index={index} {...props} />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        minDistance={MIN_CAMERA_DISTANCE}
        maxDistance={MAX_CAMERA_DISTANCE}
        autoRotate={!props.paused && props.selected === null}
        autoRotateSpeed={0.3 * props.speed}
        rotateSpeed={0.5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI - 0.3}
      />
      <CameraMotion {...props} />
    </>
  )
}
