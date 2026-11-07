# docspack

基于 React、Vite 和 MDX 的静态文档站点构建实验。项目包含文件路由、开发服务器、客户端与服务端打包、逐页静态 HTML 渲染，以及代码高亮的基础实现。

目前适合阅读源码和本地实验；默认主题、文档站和 npm 发布仍在完善中。

## 从源码启动

先准备 Node.js 和 pnpm。仓库尚未通过 `engines` 或 `packageManager` 固定工具版本；现有 `pnpm-lock.yaml` 使用 lockfile v6，使用兼容该格式的 pnpm，并保留锁文件。

```sh
git clone https://github.com/boyfeiyu/docspack.git
cd docspack
pnpm install --frozen-lockfile
pnpm build
node bin/docspack.js dev docs
```

打开终端打印的本地 URL。示例内容位于 [`docs/`](docs)，配置位于 [`docs/docspack.config.ts`](docs/docspack.config.ts)。用 `Ctrl+C` 停止开发服务器。

`pnpm build` 构建的是 **docspack 工具本身**，输出到 `dist/`；`bin/docspack.js` 会加载 `dist/cli.mjs`，因此首次运行 CLI 前需要先构建工具。

开发工具源码时，可以在另一个终端运行 `pnpm start` 持续编译工具；修改后按需要重启站点开发服务器。

## 构建示例站点

在仓库根目录执行，并明确传入内容目录：

```sh
node bin/docspack.js build docs
```

站点产物位于 `docs/build/`，与工具的 `dist/` 不同。构建逻辑先生成浏览器资源和临时服务端模块，再按路由渲染 HTML。检查构建日志及输出文件后，再使用静态文件服务器预览；当前 CLI 没有 `preview` 或 `start` 子命令。

> 当前实现仍有实验性限制：部分构建错误只打印日志，不能仅凭进程退出码判断成功；Windows 兼容性和开发路由访问也有源码 TODO/FIXME。这里给出源码对应的使用方式，不代表所有平台已通过端到端验证。

## 添加页面与配置

内容目录中的页面按文件名生成路由，例如：

| 文件 | 路由 |
| --- | --- |
| `docs/index.mdx` | `/` |
| `docs/guide/index.tsx` | `/guide/` |
| `docs/guide/a.tsx` | `/guide/a` |

支持扫描 `.js`、`.jsx`、`.ts`、`.tsx`、`.md` 和 `.mdx` 页面。React 页面需要默认导出组件；MDX 可以混合 Markdown 与组件。当前 `docs/` 中已有可参考的页面。

在内容目录放置 `docspack.config.ts` 或 `docspack.config.js`（同时存在时优先读取 `.js`）：

```ts
// docs/docspack.config.ts
export default {
  title: '我的文档',
  description: '项目说明和使用示例',
}
```

配置解析还接受 `themeConfig` 和 `vite` 字段，类型见 [`src/shared/types/index.ts`](src/shared/types/index.ts)。字段被解析不代表默认主题或静态 HTML 已完整使用它；例如当前静态渲染器的 HTML title/description 仍为占位内容。

## 检查与测试

```sh
pnpm test:unit
pnpm lint
```

单元测试使用 Vitest；浏览器测试使用 Playwright：

```sh
pnpm test:e2e
```

E2E 的 `webServer` 会调用 `prepare:e2e`，按需构建工具、安装 Playwright 浏览器和示例依赖，并启动本地站点；需要网络、可用的 5173 端口，以及当前配置要求的图形环境（`headless: false`）。它不是纯离线检查。

## 源码入口

| 入口 | 用途 |
| --- | --- |
| [`src/node/cli.ts`](src/node/cli.ts) | `dev` 与 `build` 命令 |
| [`src/node/config.ts`](src/node/config.ts) | 配置查找和默认值 |
| [`src/node/plugin-routes/RouteService.ts`](src/node/plugin-routes/RouteService.ts) | 文件扫描和路由生成 |
| [`src/node/plugin-mdx/`](src/node/plugin-mdx) | MDX 编译与代码高亮 |
| [`src/node/build.ts`](src/node/build.ts)、[`renderPage.ts`](src/node/renderPage.ts) | 打包与静态 HTML 渲染 |
| [`src/theme-default/`](src/theme-default) | 默认主题 |

后续方向：完善默认主题和明暗模式、补齐文档站、整理 monorepo 结构与 npm 发布流程。发现问题时，请附上 Node.js/pnpm 版本、执行命令、终端日志和最小页面示例。
