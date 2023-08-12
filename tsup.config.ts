import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/node/cli.ts', 'src/node/index.ts'],
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  clean: true,
  banner: {
    // 解决在esm中调用require报错的问题
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
  }
});
