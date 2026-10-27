import { toPosition } from './math/coordinates'

/** 相机、几何与动画的共享约束；相机控制和插值必须使用一致的距离限制。 */
export const HOME_POSITION = toPosition(24, 108, 6.94).toArray()
export const MIN_CAMERA_DISTANCE = 4.3
export const MAX_CAMERA_DISTANCE = 9
export const MAX_FRAME_DELTA = 0.05
export const ROUTE_SEGMENTS = 160
export const ROUTE_RADIAL_SEGMENTS = 5
// 每个径向面由 2 个三角形组成，每个三角形 3 个索引。
export const INDICES_PER_ROUTE_SEGMENT = ROUTE_RADIAL_SEGMENTS * 6
