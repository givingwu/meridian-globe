/**
 * 将模拟时间（秒）映射为路线参数区间 [start, end]，两端均在 [0,1]。
 * time 由调用方处理暂停/倍速，本函数无副作用，便于独立验证动画边界。
 * 每条路线错开 0.4 秒；黄金比例生成稳定的时长差异，不引入随机闪变。
 * 生长阶段固定起点、推进终点；收走阶段固定终点、推进起点。
 * 返回 [0,0] 表示完全隐藏，绝不保留常驻底线；不触发任何城市到达光圈。
 */
export function routeWindow(
  time: number,
  index: number,
  routeCount: number,
  output = { start: 0, end: 0 },
) {
  // 调用者可复用输出对象，20 条路线每帧不再创建 20 个短命对象。
  // 默认参数保留纯计算调用的独立结果，测试/一次性调用无需自己管理缓冲。
  output.start = 0
  output.end = 0
  const seed = (index * 0.61803398875) % 1
  const grow = 1.3 + seed * 0.4
  const retreat = 2.8 + seed * 0.8
  // 周期至少容纳全部错峰起点，也保证最长路线收走后有 0.8 秒空档。
  const cycle = Math.max(routeCount * 0.4, grow + retreat + 0.8)
  const elapsed = time - index * 0.4
  if (elapsed < 0) return output
  const age = elapsed % cycle
  if (age < grow) {
    // 二次 ease-in-out：在启动和到达时放缓，避免端点速度突变。
    const t = age / grow
    output.end = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
    return output
  }
  if (age < grow + retreat) {
    const t = (age - grow) / retreat
    // smoothstep 收尾速度为零；前 20% 再减速，保留演示中的长尾停留。
    let start = t * t * (3 - 2 * t)
    if (start < 0.2) start = start * start * 5
    output.start = start
    output.end = 1
    return output
  }
  return output
}
