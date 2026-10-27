# Meridian Globe

**一颗小小的地球，一些跨越山海的连接。**

[![CI and Pages](https://github.com/givingwu/meridian-globe/actions/workflows/ci-pages.yml/badge.svg?branch=master)](https://github.com/givingwu/meridian-globe/actions/workflows/ci-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · **简体中文**

[在线转一转](https://givingwu.github.io/meridian-globe/) · [反馈问题](https://github.com/givingwu/meridian-globe/issues) · [参与贡献](CONTRIBUTING.md#简体中文)

用 **React、TypeScript、Three.js 和 Tailwind CSS v4** 做的交互式地球实验。陆地点阵勾勒海岸线，蓝紫光晕围住深色海洋；飞线跨过球面，逐渐绘出，再慢慢收走。

![Meridian Globe：蓝色陆地点阵、跨城飞线与交互控制面板](docs/preview.png)

## 为什么做这个

最初的问题很简单：[Stripe 地球](https://stripe.com/blog/globe)带来的那种感觉，有多少可以拆成容易理解的小部件？

Meridian 就是一次拆解和重组：一个负责遮挡背面的球体，一组陆地点，一层柔和的光晕，再加几条认真调过节奏的曲线。关掉连线、暂停动画，或者跳到某座城市，就能更清楚地看到这些层次。

这是独立的视觉实验，不是 Stripe 官方项目，也不追求逐像素复刻。城市网络完全是演示数据，不代表真实交易、航班或服务覆盖范围。

## 先玩一下

- **拖拽**旋转地球，**滚轮或双指**缩放。
- 下拉选择城市，或点击城市点聚焦。**Explore the connections** 会带你到香港。
- 支持暂停、连接开关，以及 **0.5× / 1× / 2×** 倍速。
- **Reset view** 回到东亚视角。拖拽或滚轮操作会中断正在进行的镜头过渡。
- 系统开启“减少动态效果”时默认暂停，你仍可手动播放。后台标签页停止渲染。

当前包含 **13 座城市、20 条有向路线**。陆地点阵从 **68,000 个等面积球面采样点**筛选得到，共 **19,580 点**。1× 速度下，飞线约用 1.3–1.7 秒生长、2.8–3.6 秒收走，底下没有常驻淡线。城市光圈保持独立脉冲。

## 本地启动

建议使用与 CI 一致的 **Node.js 24.20.0**（见 [.node-version](.node-version)）和 **pnpm 12.4.2**。需要支持 WebGL 的现代浏览器；Tailwind v4 面向现代浏览器，本项目没有旧浏览器兼容构建。

```bash
git clone https://github.com/givingwu/meridian-globe.git
cd meridian-globe
pnpm install --frozen-lockfile
pnpm dev
```

打开终端打印的地址，通常为 **http://127.0.0.1:5173/**。不需要 API key、数据库或后端。页面唯一的外部资源是 Google Fonts，加载失败时使用系统字体。

| 命令                                | 用途                           |
| ----------------------------------- | ------------------------------ |
| `pnpm dev`                          | 启动本地开发服务与热更新       |
| `pnpm build`                        | 严格 TypeScript 检查与生产构建 |
| `pnpm preview`                      | 本地预览生成的 `dist/`         |
| `pnpm lint`                         | ESLint，包含 React Hooks 规则  |
| `pnpm test`                         | 几何、时序、状态与相机回归测试 |
| `pnpm test:browser`                 | Chromium 交互与 WebGL 资源检查 |
| `pnpm format` / `pnpm format:check` | 写入 / 检查 Prettier 格式      |
| `pnpm generate:land`                | 重新生成随项目打包的陆地点阵   |

首次运行浏览器测试前，执行 `pnpm exec playwright install chromium`。Linux CI 使用 `pnpm exec playwright install --with-deps chromium`。测试会在 5174 端口启动独立的本地服务。

## 地球是怎么画出来的

| 层次 | 实现                             | 用途                                 |
| ---- | -------------------------------- | ------------------------------------ |
| 海洋 | 不透明球体 + GLSL 着色           | 建立体积感，遮挡背面的路线           |
| 陆地 | 一个 `Points` + `BufferGeometry` | 绘制上万颗点，无需上万个 React 组件  |
| 大气 | 面向相机的平面 + 径向 shader     | 柔和发光，避免生硬的球形外壳         |
| 飞线 | 大圆插值 + 抬升的 `TubeGeometry` | 让长短路线都保持在球体外部           |
| 动画 | 沿曲线移动的可见区间             | 先推进头部，再收走尾部，最后完全隐藏 |

飞线几何在挂载时创建。`drawRange` 裁掉完整线段，片元 shader 再精确裁剪端点。逐帧计算更新 ref 和 uniform，复用临时对象，不触发 React 状态更新。关掉连接会卸载路线，由 React Three Fiber 释放声明式几何与材质；重新打开时从头错峰发射。

相机命令与城市选择状态分开管理。一个过渡器负责目标，方向和距离分别插值，用户操作时立即让出控制权。自动旋转等过渡结束后再接管；即使场景代码还没加载完成，先选中的城市也不会被初始化复位覆盖。

### 从哪里开始读

```text
src/
  app/                         页面组合
  components/                  公共 UI、布局、弹窗与错误边界
  hooks/                       浏览器可见性与动态效果偏好
  features/globe/
    GlobeExperience.tsx        功能界面与懒加载边界
    GlobeCanvas.tsx            Canvas 配置与后台停帧
    components/                场景层、相机适配与控制面板
    state/                     纯交互 reducer 与相机命令
    hooks/                     UI 事件与派生状态
    math/                      坐标、飞线曲线、时序与镜头过渡
    data/                      城市、有向路线与预生成陆地点
    shaders/                   按视觉层组织的 GLSL
    config.ts / types.ts       共享参数与接口
  styles/global.css            Tailwind 主题、组件样式与自定义效果
scripts/generate-land.mjs       离线地理采样
tests/                         单元回归与浏览器检查
```

核心代码有详细中文注释，解释单位、边界情况、资源归属和清理方式。想理解动画节奏，先读 `routeAnimation.ts`；想看镜头运动，读 `CameraTransition.ts`；想换城市，从 `network.ts` 开始。

### 改成你自己的版本

| 想改什么                   | 对应文件                                                       |
| -------------------------- | -------------------------------------------------------------- |
| 城市、路线、强调色         | [network.ts](src/features/globe/data/network.ts)               |
| 飞线生长与收走节奏         | [routeAnimation.ts](src/features/globe/math/routeAnimation.ts) |
| 初始镜头与距离限制         | [config.ts](src/features/globe/config.ts)                      |
| 海洋、点阵、光晕和飞线着色 | [shaders/](src/features/globe/shaders/)                        |
| 字体、布局与响应式样式     | [global.css](src/styles/global.css)                            |
| 陆地点阵密度               | [generate-land.mjs](scripts/generate-land.mjs)                 |

路线使用城市**数组索引**。调整城市顺序时，需要一起调整路线；测试会检查无效索引和未连接城市。`HK` 是显示简称，不是机场代码。

Tailwind 使用官方 Vite 插件和 CSS-first 主题配置。共享视觉组件通过 `@apply` 组合工具类，简单布局也直接在 JSX 使用 utilities。为避免标题默认样式、按钮和 SVG 对齐变化，迁移时保留原有基础 reset，没有引入 Preflight。多层渐变和精确过渡继续用自定义 CSS；WebGL 的视觉效果仍由 shader 实现。

## 检查与部署

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm test:browser
pnpm build
```

指向 `master` 的 PR 会执行这些检查。浏览器测试覆盖弹窗焦点恢复、减少动态效果、移动端控件，并在反复切换连接时观察实际 WebGL buffer/program 的分配与释放。单元测试覆盖相机命令顺序、收敛、中断、极端地理位置和飞线边界。这些是回归检查，不是所有 GPU 上的性能保证。

仓库的 `master` 对管理员同样启用保护：通过 PR 合并，保持分支最新，**Validate and build** 通过，讨论已解决。个人仓库不额外要求审批人数，禁止强推和删除分支。

合并后，`master` 再次验证，通过后把同一构建产物自动部署到 [GitHub Pages](https://givingwu.github.io/meridian-globe/)。PR 无部署权限。Actions 固定到提交 SHA，只有部署任务拥有 Pages/OIDC 写权限。

在自己的 fork 中启用部署：

1. 设置 **Settings → Pages → Source → GitHub Actions**。
2. 默认分支保留为 `master`；改名时同步修改工作流触发器和条件。
3. 在自己的仓库配置分支保护与 Pages environment，这些设置不会随 fork 继承。

工作流根据仓库名生成 Pages 路径。部署到其他静态托管时，通过 `VITE_BASE_PATH` 调整路径，并发布 `dist/`：

```bash
VITE_BASE_PATH=/meridian-globe/ pnpm build
pnpm preview
```

## 还有哪些边界

- 它是视觉演示，不是可直接集成的地球 SDK，也不是实时网络地图。
- Three.js 和点阵数据让部分 JavaScript 分块较大。场景已懒加载，但构建仍有 Vite 的 500 kB 分块提示。
- 暂停会冻结视觉时间；前台 Canvas 仍渲染，以便继续操作相机。后台标签页才会停止帧循环。
- DPR 上限为 1.8。帧率取决于设备、窗口尺寸与浏览器，不承诺所有设备固定 60 fps。

如果哪里不对，一张截图、浏览器和设备信息，加上几步复现，比一句“感觉有点卡”更容易定位。欢迎小修复、更清楚的说明，以及有测量依据的性能改进。具体流程见[贡献指南](CONTRIBUTING.md#简体中文)。

## 致谢与许可

- [Stripe 的地球工程文章](https://stripe.com/blog/globe)：视觉与工程灵感。
- [Natural Earth](https://www.naturalearthdata.com/) / [world-atlas](https://github.com/topojson/world-atlas)：公共领域的陆地轮廓数据。
- React、Three.js、React Three Fiber、Drei、Tailwind CSS、Vite 和 Lucide：构建这个实验的基础。
- Google Fonts 提供的 DM Sans 与 Manrope 字体。

项目采用 [MIT License](LICENSE)。第三方依赖、字体和地理数据分别遵循各自许可。如果你用它做了有意思的东西，欢迎分享链接；除 MIT 要求保留的许可声明外，项目不强制要求额外署名链接。
