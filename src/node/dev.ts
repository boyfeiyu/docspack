// https://cn.vitejs.dev/guide/api-javascript.html#createserver

import { createServer } from 'vite';
import { resolveConfig } from './config';

import { PACKAGE_ROOT } from './constants';
import { createVitePlugins } from './vitePlugins';

export async function createDevServer(root = process.cwd()) {
  // FIXME dev访问路由时偶尔会直接返回静态资源
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
