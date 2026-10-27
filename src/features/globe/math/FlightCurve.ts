import { Curve, Vector3 } from 'three'

/**
 * Three.js Curve 接口的球面飞行路径，输入只取方向，内部克隆后归一化。
 * getPoint(t) 的 t∈[0,1]，TubeGeometry 会反复采样，target 可由调用方复用。
 * 大圆插值决定方向，sin(πt) 抬升半径；两端半径 2.018，始终略高于海洋。
 * 不能简单线性插值 XYZ：弦会穿入球体，被海洋遮挡。
 */
export class FlightCurve extends Curve<Vector3> {
  private a: Vector3
  private b: Vector3
  constructor(a: Vector3, b: Vector3) {
    super()
    this.a = a.clone().normalize()
    this.b = b.clone().normalize()
  }
  getPoint(t: number, target = new Vector3()) {
    const angle = this.a.angleTo(this.b)
    // 球面线性插值权重：sin((1-t)θ)/sinθ 与 sin(tθ)/sinθ。
    // θ≈0 或 π 时分母接近零，必须单独处理，避免 NaN 传播到 GPU。
    const denominator = Math.sin(angle)
    if (Math.abs(denominator) < 1e-6) {
      if (angle < 1e-6) return target.copy(this.a).multiplyScalar(2.018)
      // 对跖点之间有无数条大圆，选择与起点不平行的参考轴构造稳定法向。
      // 重合点则直接返回起点，避免归一化零向量。
      const axis = new Vector3()
        .crossVectors(
          this.a,
          Math.abs(this.a.y) < 0.9
            ? new Vector3(0, 1, 0)
            : new Vector3(1, 0, 0),
        )
        .normalize()
      target.copy(this.a).applyAxisAngle(axis, Math.PI * t)
    } else {
      target
        .copy(this.a)
        .multiplyScalar(Math.sin((1 - t) * angle) / denominator)
        .addScaledVector(this.b, Math.sin(t * angle) / denominator)
    }
    // 先恢复单位长度，再抬升。高度上限限制长航线，不让弧线离地过远。
    return target
      .normalize()
      .multiplyScalar(
        2.018 + Math.sin(Math.PI * t) * Math.min(angle * 0.53, 0.95),
      )
  }
}
