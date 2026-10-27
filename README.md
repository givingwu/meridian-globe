# Meridian Globe

[![CI and Pages](https://github.com/givingwu/meridian-globe/actions/workflows/ci-pages.yml/badge.svg)](https://github.com/givingwu/meridian-globe/actions/workflows/ci-pages.yml)

[在线体验](https://givingwu.github.io/meridian-globe/) · [GitHub Actions](https://github.com/givingwu/meridian-globe/actions)

一个基于 **React、TypeScript 和 Three.js** 的交互式地球实验：真实陆地点阵、深蓝海洋、柔和大气光晕，以及从起点逐步绘制、到达后收走的跨城飞线。

灵感来自 [Stripe — To design and develop an interactive globe](https://stripe.com/blog/globe)。本项目是独立实现，非 Stripe 官方项目，也不是原站的逐像素复制。所有路线均为演示数据，不代表真实交易、交通或服务覆盖范围。

![Meridian Globe preview](docs/preview.png)

## 功能

- **真实地理轮廓**：68,000 个 Fibonacci 球面采样点，经 Natural Earth 陆地边界筛选，形成 19,580 个陆地点。
- **三维视觉**：深蓝海洋、缓慢变化的色带、蓝紫渐变外围光晕，以及轻微闪烁的陆地点阵。
- **渐进飞线**：约 1.3–1.7 秒从起点绘制至终点，再用约 2.8–3.6 秒从起点向终点收走；不同路线错峰循环，无常驻淡线。
- **城市探索**：13 个城市、20 条演示连接；支持城市选择、悬停标签、点击聚焦和重置视角。
- **交互控制**：拖拽旋转、滚轮/双指缩放、暂停/播放、连接开关、0.5× / 1× / 2× 调速。
- **适配与性能**：响应式布局、系统减少动态效果偏好、后台标签页停帧、DPR 上限和场景懒加载。

城市点当前使用独立循环的扩散光圈；没有飞线到达时触发的光圈。

## 本地启动

### 环境

- Node.js **22.18+**（测试直接运行 TypeScript 源码，使用 Node 原生类型剥离能力）
- pnpm **12.x**（开发环境使用 12.4.2）
- 支持 WebGL 的现代浏览器

```bash
git clone https://github.com/givingwu/meridian-globe.git
cd meridian-globe
pnpm install --frozen-lockfile
pnpm dev
```

打开终端打印的地址，默认是 `http://127.0.0.1:5173/`。开发服务仅监听本机，无需 API key、数据库或后端。

### 常用命令

| 命令                 | 用途                                  |
| -------------------- | ------------------------------------- |
| `pnpm dev`           | 启动开发服务与热更新                  |
| `pnpm build`         | TypeScript 严格类型检查并生成生产产物 |
| `pnpm preview`       | 本地预览 `dist/` 产物                 |
| `pnpm test`          | 运行几何、城市数据与动画时序测试      |
| `pnpm format`        | 使用 Prettier 格式化源码              |
| `pnpm format:check`  | 检查格式                              |
| `pnpm generate:land` | 根据地理数据重新生成陆地点坐标        |

## 使用方式

拖动地球旋转，滚轮或双指缩放；右侧提供放大、缩小与重置按钮。使用城市选择器或点击城市点可平滑聚焦。初始及重置视角朝向东亚，`Explore the connections` 聚焦香港。

底部控制栏可暂停动画、切换连接显示和调整速度。如果系统开启“减少动态效果”，页面初始暂停，可手动播放。

当前城市：伦敦、旧金山、纽约、新加坡、东京、悉尼、圣保罗、开普敦、迪拜、巴黎、孟买、多伦多、香港。`HK` 是界面简称，不是机场代码。

## 实现原理

### 海洋与大气

海洋是一个不透明球体，用于正确遮挡背面的点阵和路线。自定义 GLSL shader 绘制深蓝渐变与缓慢变化的色带。面向相机的透明平面通过径向 shader 生成柔和光晕。

### 陆地点阵

`scripts/generate-land.mjs` 用 Fibonacci 分布均匀采样球面，通过 `world-atlas` 的 Natural Earth 1:110m 陆地轮廓筛选点位，再写入 `src/features/globe/data/land.json`。

运行时使用单个 `Points / BufferGeometry` 绘制点阵，并通过 shader 控制颜色和闪烁，避免创建数万个 React 组件或逐帧进行地理计算。

### 飞线与时间控制

`FlightCurve` 沿大圆方向插值并叠加正弦高度，使路线始终位于海洋球体外部，同时处理重合和对跖点。

`routeWindow()` 返回当前可见区间：

1. 起点固定为 0，终点以缓入缓出曲线从 0 增至 1。
2. 终点保持为 1，起点逐渐从 0 增至 1，收走整条飞线。
3. 完全隐藏，等待下一轮发射。

几何体预先创建并复用，通过 `drawRange` 减少实际绘制的三角形，fragment shader 精确裁剪区间边缘。动画在 `useFrame` 中更新 ref 与 uniforms，不使用逐帧 `setState`，也不逐帧重建几何。

镜头聚焦使用四元数沿球面转向，保持观察距离，避免跨城市切换时镜头穿过地球。

## 项目结构

```text
src/
  app/App.tsx                  页面组合与说明弹窗状态
  components/                  DOM 组件、布局、错误边界、原生 dialog
  hooks/useBrowserPreferences.ts 浏览器可见性/减少动态效果订阅
  features/globe/
    GlobeExperience.tsx        功能入口与交互布局
    GlobeCanvas.tsx            懒加载 Canvas、后台停帧
    config.ts / types.ts       场景参数与组件契约
    components/                场景、点阵、海洋、飞线、城市、镜头与控件
    hooks/useGlobeControls.ts  用户操作入口与派生状态
    state/controls.ts         可独立测试的纯 reducer
    data/                     城市、路线与预生成陆地点阵
    math/                     经纬度转换、大圆弧线、动画时序
    shaders/                  按视觉层拆分的 GLSL
  styles/global.css           页面与响应式样式
scripts/
  generate-land.mjs   地理数据生成脚本
tests/
  controls.test.mjs       重置、缩放、探索与播放状态边界
  geometry.test.mjs       坐标、弧线边界、地理数据与城市列表
  routeAnimation.test.mjs 飞线生长、收走及错峰区间验证
docs/
  preview.png         效果截图
```

## React 状态与资源边界

- 用户意图由功能内的纯 reducer 管理；重置和探索等复合操作一次更新完成。系统动态偏好通过 `useSyncExternalStore` 订阅，用户操作优先。
- 每帧进度、相机目标放在 ref 中，GPU uniforms 原位更新；不在帧循环触发 React 渲染。几何和材质参数保持稳定，R3F 在卸载时释放声明式资源。
- Effect 只同步相机/浏览器等外部系统，并对监听、dialog 与页面滚动锁提供对称清理，兼容 StrictMode。
- lazy 在模块级声明，Suspense 与错误边界分别处理加载和失败；原生 dialog 提供焦点约束、Escape 和关闭后的焦点恢复。
- 核心代码注释说明单位、坐标约定、算法边界、资源所有权及选择原因。城市独立脉冲和飞线生长/收走效果保持原版行为。

## 自定义

- **城市与路线**：编辑 `src/features/globe/data/network.ts` 中的 `cities` 和 `routes`。路线的两个数字分别是起点与终点在城市数组中的索引；修改城市顺序时需同步修改路线。
- **颜色与光晕**：编辑 `src/features/globe/shaders/`，飞线与城市的颜色列表位于 `src/features/globe/data/network.ts`。
- **动画节奏**：编辑 `src/features/globe/math/routeAnimation.ts` 中的生长、收走与错峰时间。
- **点阵密度**：修改生成脚本中的采样数量，运行 `pnpm generate:land`，并同步检查数据规模测试与文档。

## 验证与部署

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

包含 12 项几何、动画与交互状态测试，覆盖坐标方向、弧线端点和球体外部约束、极端地理位置、陆地数据、城市列表及动画边界。

默认分支为 `master`。`.github/workflows/ci-pages.yml` 在 PR 指向 `master`、推送到 `master` 或手动触发时，安装锁定依赖，执行格式检查、ESLint（含 React Hooks 规则）、单元测试与 TypeScript/生产构建。

只有 `master` 上通过验证的构建产物会上传并部署至 **https://givingwu.github.io/meridian-globe/**。PR（包括 fork PR）只验证，不具备部署权限。合并 PR 后触发的 `push` 会自动发布，分支保护禁止直接推送。

工作流固定 Actions 的完整提交 SHA，使用 pnpm 缓存、明确 Node/pnpm 版本、任务超时和并发控制。默认令牌只读，只有部署任务获得 Pages/OIDC 写权限。Dependabot 每周检查 Actions 更新。部署使用 `github-pages` environment，不需要个人访问令牌或额外仓库密钥。

GitHub 仓库的 **Settings → Pages → Source** 必须为 **GitHub Actions**。若复制本仓库，需要在新仓库启用此设置。`master` 已启用分支保护（包括管理员）：必须通过 PR 合并，分支需与 `master` 保持同步，且 GitHub Actions 的 `Validate and build` 检查通过；讨论需解决，禁止强推、删除和非线性合并。当前不要求额外审批人数，适合个人仓库；CI 与 PR 要求仍强制执行。分支保护是 GitHub 仓库设置，fork 不会自动继承。

推荐流程：新建功能分支 → 提交 PR → CI 通过 → squash/rebase 合并 → `master` 再次验证 → 自动部署 Pages。页面右上角的 GitHub 快捷链接在新窗口打开源码仓库。

`VITE_BASE_PATH` 控制部署路径：工作流设为 `/<仓库名>/`，本地开发默认为 `/`。构建后也可将 `dist/` 放到其他静态托管服务。

```bash
VITE_BASE_PATH=/meridian-globe/ pnpm build
pnpm preview
```

Three.js 和地理数据使部分构建分块超过 Vite 默认的 500 kB 提示阈值；这是体积提示，不是构建失败。帧率取决于设备 GPU、分辨率和浏览器，未承诺所有设备固定 60fps。

## 数据与致谢

- 视觉原理参考：[Stripe globe 工程文章](https://stripe.com/blog/globe)。
- 地理轮廓：`world-atlas` / Natural Earth，Natural Earth 数据为 public domain；地理数据已随项目打包。
- 飞线生长与收走的节奏参考项目开发时提供的演示，实现使用可复用几何与独立时序函数。
- 核心依赖：React、Three.js、React Three Fiber、Drei、Vite、Lucide。
- 字体通过 Google Fonts 加载，无法访问时回退到系统字体。

第三方依赖与素材的许可分别由其上游项目规定。
