// https://cn.vitejs.dev/guide/api-javascript.html#createserver

import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-docspack/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-docspack/config';
import { pluginRoutes } from './plugin-routes';

import { PACKAGE_ROOT } from './constants';

export async function createDevServer(root = process.cwd()) {
  // FIXME dev访问路由时偶尔会直接返回静态资源
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact({
        jsxRuntime: 'automatic'
      }),
      pluginConfig(config),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
