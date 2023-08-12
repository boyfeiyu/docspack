import { readFile } from 'fs/promises';
import { Plugin } from 'vite';
import { DEFAULT_HTML_PATH } from '../constants';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'docspack:index-html',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, 'utf-8');
          html = await server.transformIndexHtml(
            req.url!,
            html,
            req.originalUrl
          );
          try {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}
