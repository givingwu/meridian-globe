# Contributing / 参与贡献

[README (English)](README.md) · [README（简体中文）](README.zh-CN.md)

## English

Thanks for taking a look. A small, well-explained fix is a great contribution; you do not need to redesign the whole globe.

For bugs, open an [issue](https://github.com/givingwu/meridian-globe/issues) with the browser and device, reproduction steps, what you expected, and a screenshot or recording if useful. For visual or architectural changes, describe the idea before investing in a large rewrite.

1. Fork the repository and create a branch from `master`.
2. Use the Node and pnpm versions in the README; install with `pnpm install --frozen-lockfile`.
3. Keep the change focused. Add a regression test when fixing behavior. For visual changes, include desktop and mobile screenshots; for performance changes, include the measurement method and device.
4. Run `pnpm format:check`, `pnpm lint`, `pnpm test`, `pnpm test:browser`, and `pnpm build`. Install Chromium with `pnpm exec playwright install chromium` first.
5. Open a PR against `master`, explaining the problem, the result and how you checked it. CI must pass before merge.

Keep README.md and README.zh-CN.md in sync for user-facing changes. Core code comments are currently in Chinese; clear English additions are welcome too. Do not put React state updates or new geometry/material construction in frame callbacks. New browser listeners and GPU resources need a clear owner and cleanup path.

Contributions are made under the repository's [MIT License](LICENSE). Please do not commit credentials or assets you do not have permission to distribute.

## 简体中文

谢谢你愿意看看这个项目。一个解释清楚的小修复就很好，不必先把整个地球重写一遍。

反馈问题时，请在 [issue](https://github.com/givingwu/meridian-globe/issues) 中写明浏览器、设备、复现步骤和预期结果；截图或录屏能说明问题时，也请一起附上。较大的视觉或架构变更，建议先描述想法，再投入时间。

1. Fork 仓库，从 `master` 创建分支。
2. 使用 README 中的 Node 和 pnpm 版本，执行 `pnpm install --frozen-lockfile`。
3. 一次聚焦一个问题。行为修复补回归测试；视觉变更附桌面和移动端截图；性能变更说明测量方式与设备。
4. 执行 `pnpm format:check`、`pnpm lint`、`pnpm test`、`pnpm test:browser` 和 `pnpm build`。浏览器测试前先用 `pnpm exec playwright install chromium` 安装 Chromium。
5. 提交指向 `master` 的 PR，说明问题、改动结果和验证方式。CI 通过后才能合并。

影响使用方式的变更请同步更新中英文 README。核心注释目前以中文为主，也欢迎清楚的英文说明。不要在帧回调中更新 React state 或创建新的几何、材质；新增浏览器监听和 GPU 资源时，写清楚归属与清理路径。

贡献采用仓库的 [MIT License](LICENSE)。请勿提交凭据或没有分发权限的素材。
