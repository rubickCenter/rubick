/* eslint-disable */
import path from "path";
import {app} from "electron";
import fs from "fs";

const appPath = app.getPath("cache");

export default () => {
  // 读取所有插件
  const totalPlugins = global.LOCAL_PLUGINS.getLocalPlugins();
  let systemPlugins = totalPlugins.filter((plugin) => plugin.pluginType === "system");
  const baseDir = path.join(appPath, "./rubick-plugins");

  systemPlugins = systemPlugins.map((plugin) => {
    const pluginPath = path.resolve(
      baseDir,
      "node_modules",
      plugin.name
    );
    return {
      ...plugin,
      indexPath: path.join(
        pluginPath,
        "./",
        plugin.entry
      ),
    }
  });

  const hooks = {
    onReady: [],
  };

  systemPlugins.forEach((plugin) => {
    if (fs.existsSync(plugin.indexPath)) {
      const pluginModule = __non_webpack_require__(plugin.indexPath)();
      // @ts-ignore
      hooks.onReady.push(pluginModule.onReady);
    }
  });

  const triggerReadyHooks = (ctx) => {
    // @ts-ignore
    hooks.onReady.forEach(hook => hook(ctx));
  }

  return {
    triggerReadyHooks
  };
}
