import { build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { type RollupOutput } from 'rollup';
import { renderPage } from './renderPage';

export async function bundle(root: string) {
  try {
    const clientBuild = async () => {
      return viteBuild({
        mode: 'production',
        root,
        build: {
          outDir: 'buildDist',
          rollupOptions: {
            input: CLIENT_ENTRY_PATH
          }
        }
      });
    };
    const serverBuild = async () => {
      return viteBuild({
        mode: 'production',
        root,
        build: {
          ssr: true,
          outDir: 'buildDist/.temp',
          rollupOptions: {
            input: SERVER_ENTRY_PATH,
            output: {
              format: 'cjs'
            }
          }
        }
      });
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
    const { render } = await import(
      `${root}/buildDist/.temp/${serverEntryPath}`
    );
    await renderPage(render, root, clientBundle);
  } catch (error) {
    console.log(error);
  }
}
