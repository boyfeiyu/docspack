import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdxRollup/index';

export function createPluginMdx(): Plugin {
  return pluginMdxRollup() as unknown as Plugin;
}
