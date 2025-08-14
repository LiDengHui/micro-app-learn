import type { Plugin } from "vite";
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
export declare function microConfigPlugin(options?: MicroConfigPluginOptions): Plugin;
export default microConfigPlugin;
