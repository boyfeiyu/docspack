import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

export function defineConfig(config: UserConfig) {
  return config;
}

function getUserConfigPath(root: string) {
  try {
    const supportedConfigFiles = ['docspack.config.js', 'docspack.config.ts'];
    // 1. 从 root 目录开始查找是否存在配置文件
    const configPath = supportedConfigFiles
      .map((file) => resolve(root, file))
      .find((file) => fs.pathExistsSync(file));
    // 2. 如果存在，返回配置文件的路径
    return configPath;
  } catch (error) {
    console.error(`Failed to load user config.${error}}`);
  }
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  // 1. 获取配置文件路径
  const configPath = getUserConfigPath(root);
  // 2. 读取配置文件的内容
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig as UserConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'Docspack',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  return {
    root,
    configPath,
    siteData: resolveSiteData(userConfig)
  };
}
