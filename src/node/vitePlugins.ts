import { pluginIndexHtml } from './plugin-docspack/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-docspack/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from '../shared/types';
import { pluginMdx } from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';
export async function createVitePlugins(config: SiteConfig, isSSR = false) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config),
    pluginRoutes({ root: config.root, isSSR }),
    await pluginMdx(),
    pluginUnocss(unocssOptions)
  ];
}
