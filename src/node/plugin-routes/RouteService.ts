// 你需要在项目中安装 fast-glob 包
import fastGlob from 'fast-glob';
import { normalizePath } from 'vite';
import path from 'path';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];

  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    // 扫描目录下文件
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: [
          '**/node_modules/**',
          '**/build/**',
          'config.ts',
          'docspack.config.ts'
        ]
      })
      .sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      // 2. 文件绝对路径
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  // 获取路由数据，方便测试
  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  // 规范化路由路径
  normalizeRoutePath(rawPath: string) {
    // 1.去掉后缀名 2.index为'/' 3.以'/开头'
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  // 生成路由代码
  generateRoutesCode(isSSR = false) {
    return `
  import React from 'react';
  ${isSSR ? '' : 'import loadable from "@loadable/component";'}
  ${this.#routeData
    .map((route, index) => {
      return isSSR
        ? `import Route${index} from "${route.absolutePath}";`
        : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
    })
    .join('\n')}
  export const routes = [
  ${this.#routeData
    .map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
    })
    .join(',\n')}
  ];
  `;
  }
}
