import type { Plugin } from "vite";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface MicroConfigPluginOptions {
  /**
   * 项目根目录路径
   */
  root?: string;
  /**
   * package.json 文件路径
   */
  packagePath?: string;
  /**
   * micro.config.json 文件路径
   */
  microConfigPath?: string;
  /**
   * 输出文件名
   */
  outputFileName?: string;
}

/**
 * Vite 插件：合并 package.json 和 micro.config.json
 * 在构建时将 package.json 的 name 和 version 与 micro.config.json 合并
 */
export function microConfigPlugin(
  options: MicroConfigPluginOptions = {}
): Plugin {
  const {
    root = process.cwd(),
    packagePath = resolve(root, "package.json"),
    microConfigPath = resolve(root, "micro.config.json"),
    outputFileName = "micro.config.json",
  } = options;

  return {
    name: "vite-plugin-micro-config",
    apply: "build",

    async writeBundle() {
      try {
        // 读取 package.json
        if (!existsSync(packagePath)) {
          console.warn(
            `[vite-plugin-micro-config] package.json not found at: ${packagePath}`
          );
          return;
        }

        const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
        const { name, version } = packageJson;

        // 读取 micro.config.json
        if (!existsSync(microConfigPath)) {
          console.warn(
            `[vite-plugin-micro-config] micro.config.json not found at: ${microConfigPath}`
          );
          return;
        }

        const microConfig = JSON.parse(readFileSync(microConfigPath, "utf-8"));

        // 合并配置
        const mergedConfig = {
          name,
          version,
          // 添加构建信息
          buildInfo: {
            buildTime: new Date().toISOString(),
            buildEnv: process.env.NODE_ENV || "production",
          },
          ...microConfig,
        };

        // 确保 dist 目录存在
        const distPath = resolve(root, "dist");
        const outputPath = resolve(distPath, outputFileName);

        // 写入合并后的配置文件
        writeFileSync(
          outputPath,
          JSON.stringify(mergedConfig, null, 2),
          "utf-8"
        );

        console.log(
          `[vite-plugin-micro-config] Successfully merged config to: ${outputPath}`
        );
        console.log(`[vite-plugin-micro-config] Merged config:`, {
          name,
          version,
          code: microConfig.code,
          pages: Object.keys(microConfig.pages || {}).length,
        });
      } catch (error) {
        console.error(
          "[vite-plugin-micro-config] Error merging config:",
          error
        );
        throw error;
      }
    },
  };
}

export default microConfigPlugin;
