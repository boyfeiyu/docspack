import { Plugin } from 'vite';
import { RouteService } from './RouteService';

// 此插件实现：文件目录结构 -> 路由数据

interface PluginOptions {
  root: string;
}

export const CONVENTIONAL_ROUTE_ID = 'docspack:routes';

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);

  return {
    name: 'docspack:routes',
    async configResolved() {
      // Vite 启动时，对 RouteService 进行初始化
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },

    load(id: string) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode();
      }
    }
  };
}
