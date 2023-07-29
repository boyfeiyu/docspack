// https://cn.vitejs.dev/guide/api-javascript.html#createserver

import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-docspack/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-docspack/config';
import { PACKAGE_ROOT } from './constants';

export async function createDevServer(root = process.cwd()) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return createServer({
    root: PACKAGE_ROOT,
    plugins: [pluginIndexHtml(config), pluginReact(), pluginConfig(config)]
  });
}
