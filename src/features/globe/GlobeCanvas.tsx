import { Canvas } from '@react-three/fiber'
import { usePageVisibility } from '../../hooks/useBrowserPreferences'
import { HOME_POSITION } from './config'
import { GlobeScene } from './components/GlobeScene'
import type { GlobeProps } from './types'

/**
 * 懒加载入口：Three.js 与陆地点阵数据只在地球功能被加载时进入浏览器。
 * DPR 上限控制高密度屏幕的像素成本。后台停帧不卸载场景，恢复时保留相机和进度。
 * JSX 声明的 geometry/material 由 R3F 在卸载时释放；不手动提前 dispose 共享资源。
 */
export default function GlobeCanvas(props: GlobeProps) {
  const visible = usePageVisibility()
  return (
    <Canvas
      camera={{ position: HOME_POSITION, fov: 43 }}
      dpr={[1, 1.8]}
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true }}
      fallback={
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] text-[13px] text-[#a69bcf]"
          data-ui="fallback"
        >
          当前浏览器不支持 WebGL，请使用开启硬件加速的浏览器。
        </div>
      }
    >
      <GlobeScene {...props} />
    </Canvas>
  )
}
