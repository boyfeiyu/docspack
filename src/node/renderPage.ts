import fs from 'fs-extra';
import { dirname, join } from 'path';
import { ReactElement } from 'react';
import type { RollupOutput } from 'rollup';

export async function renderPage(
  render: (pagePath: string) => string,
  root: string,
  routes: {
    path: string;
    element: ReactElement;
  }[],
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side...');
  // TODO 用Promise改造 性能优化
  routes.map(async (route) => {
    const appHtml = render(route.path);
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="/${clientChunk?.fileName}"></script>
    </body>
  </html>`.trim();
    const fileName = route.path.endsWith('/')
      ? `${route.path}index.html`
      : `${route.path}.html`;
    console.log(fileName, 'fileName');
    await fs.ensureDir(join(root, 'build', dirname(fileName)));
    await fs.writeFile(join(root, 'build', fileName), html);
  });

  await fs.remove(join(root, 'build/.temp'));
}
