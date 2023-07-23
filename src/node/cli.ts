import { cac } from 'cac';
import { createDevServer } from './dev';
const version = require('../../package.json').version;
const cli = cac('island').version(version).help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const server = await createDevServer();
    await server.listen();
    server.printUrls();
    console.log('dev', root);
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    console.log('build', root);
  });

cli.parse();
