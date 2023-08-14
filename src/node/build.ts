import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { type RollupOutput } from 'rollup';
import { renderPage } from './renderPage';
import { SiteConfig } from '@/shared/types';
import { createVitePlugins } from './vitePlugins';
// TODO 兼容windows
export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    // 自动注入 import React from 'react'，避免 React is not defined 的错误
    plugins: await createVitePlugins(config, isServer),
    ssr: {
      // 防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
      noExternal: ['react-router-dom']
    },
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
      return viteBuild(await resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
    };

    // return await Promise.all([clientBuild(), serverBuild()]);
    // return await Promise.all([serverBuild(), clientBuild()]);
    // FIXME 这里不能用PromisAll 否则server打包文件不出来
    const clientBundle = await clientBuild();
    const serverBundle = await serverBuild();
    return [clientBundle, serverBundle];
  } catch (error) {
    console.log(error);
  }
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  try {
    const [clientBundle, serverBundle] = (await bundle(root, config)) as [
      RollupOutput,
      RollupOutput
    ];

    // 引入ssr入口模块
    const serverEntryPath = serverBundle.output[0].fileName;
    const { render, routes } = await import(
      `${root}/build/.temp/${serverEntryPath}`
    );
    await renderPage(render, root, routes, clientBundle);
  } catch (error) {
    console.log(error);
  }
}
