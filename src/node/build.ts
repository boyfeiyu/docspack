import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { type RollupOutput } from 'rollup';
import { renderPage } from './renderPage';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-docspack/config';
import { resolveConfig } from './config';

export async function bundle(root: string) {
  const config = await resolveConfig(root, 'build', 'production');

  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    // 自动注入 import React from 'react'，避免 React is not defined 的错误
    plugins: [pluginConfig(config), pluginReact()],
    build: {
      ssr: isServer,
      outDir: isServer ? 'build/.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });

  try {
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    return await Promise.all([clientBuild(), serverBuild()]);
  } catch (error) {
    console.log(error);
  }
}

export async function build(root: string = process.cwd()) {
  try {
    const [clientBundle, serverBundle] = (await bundle(root)) as [
      RollupOutput,
      RollupOutput
    ];

    // 引入ssr入口模块
    const serverEntryPath = serverBundle.output[0].fileName;
    const { render } = await import(`${root}/build/.temp/${serverEntryPath}`);
    await renderPage(render, root, clientBundle);
  } catch (error) {
    console.log(error);
  }
}
