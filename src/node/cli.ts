import { cac } from 'cac';
import { createDevServer } from './dev';
import { resolve } from 'path';
import { build } from './build';
import { resolveConfig } from './config';
const version = require('../../package.json').version;
const cli = cac('docspack').version(version).help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
    console.log('dev', root);
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      const config = await resolveConfig(root, 'build', 'production');

      root = resolve(root);
      await build(root, config);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
