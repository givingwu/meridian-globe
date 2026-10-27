import { Vector3 } from 'three'

/**
 * 将角度制经纬度映射至右手坐标系；纬度北正南负，经度东正西负。
 * 北极为 +Y，(0°,0°) 位于 +Z，东经 90° 位于 +X。
 * 球面投影的水平半径为 cos(latitude)，高度为 sin(latitude)。
 * radius 的单位是场景单位（默认海洋半径 2），不是公里；不修改输入。
 * 离线生成脚本必须使用相同约定，否则点阵和城市会左右镜像。
 */
export function toPosition(lat: number, lon: number, radius = 2) {
  const phi = (lat * Math.PI) / 180,
    theta = (lon * Math.PI) / 180
  return new Vector3(
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(theta),
  ).multiplyScalar(radius)
}
