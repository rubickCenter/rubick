/**
 * 插件管理器配置
 * @param baseDir 插件安装目录
 * @param registry 插件下载源 即 npm 源
 * @export
 * @interface AdapterHandlerOptions
 */
export interface AdapterHandlerOptions {
  baseDir: string;
  registry?: string;
}

/**
 * 插件信息, 对应 plugin.json
 * @export
 * @interface AdapterInfo
 */
export interface AdapterInfo {
  // 插件类型
  type: "adapter";
  // 插件名称 rubick-adapter-xxx
  name: string;
  // 可读插件名称
  pluginName: string;
  // 作者
  author: string;
  // 描述
  description: string;
  // 入口文件
  main: string;
  // 版本
  version: string;
  // logo地址
  logo: string;
}

// 插件运行状态
export type AdapterStatus = "RUNNING" | "STOPED" | "ERROR";
