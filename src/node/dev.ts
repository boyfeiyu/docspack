// https://cn.vitejs.dev/guide/api-javascript.html#createserver

import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-docspack/indexHtml';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root = process.cwd()) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}
