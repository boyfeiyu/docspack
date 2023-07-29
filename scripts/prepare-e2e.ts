import path from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  try {
    // ensure after build
    if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
      // exec build command
      await execa.commandSync('pnpm build', {
        ...defaultExecaOpts,
        cwd: path.join(__dirname, '../')
      });
    }

    await execa.commandSync('npx playwright install', {
      ...defaultExecaOpts,
      cwd: path.join(__dirname, '../')
    });

    await execa.commandSync('pnpm i', defaultExecaOpts);

    // exec dev command
    await execa.commandSync('pnpm dev', defaultExecaOpts);
  } catch (error) {
    console.log(error);
  }
}

prepareE2E();
