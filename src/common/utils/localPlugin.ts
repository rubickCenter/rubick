import path from "path";
import fs from "fs";
import getLocalDataFile from "./getLocalDataFile";
import { PluginHandler } from "@/core";
import { PLUGIN_INSTALL_DIR as baseDir } from "@/common/constans/main";

const configPath = path.join(getLocalDataFile(), "./rubick-local-plugin.json");

const pluginInstance = new PluginHandler({
  baseDir,
});

global.LOCAL_PLUGINS = {
  PLUGINS: [],
  async downloadPlugin(plugin) {
    console.log(plugin);
    await pluginInstance.install([plugin.name], { isDev: plugin.isDev });
    if (plugin.isDev) {
      // 获取 dev 插件信息
      const pluginPath = path.resolve(
        baseDir,
        "node_modules",
        plugin.name
      );
      const pluginInfo = JSON.parse(
        fs.readFileSync(path.join(pluginPath, "./package.json"), "utf8")
      );
      plugin = {
        ...plugin,
        ...pluginInfo,
      };
    }
    console.log(plugin);
    global.LOCAL_PLUGINS.addPlugin(plugin);
    return global.LOCAL_PLUGINS.PLUGINS;
  },
  getLocalPlugins() {
    try {
      if (!global.LOCAL_PLUGINS.PLUGINS.length) {
        global.LOCAL_PLUGINS.PLUGINS = JSON.parse(
          fs.readFileSync(configPath, "utf-8")
        );
      }
      return global.LOCAL_PLUGINS.PLUGINS;
    } catch (e) {
      global.LOCAL_PLUGINS.PLUGINS = [];
      return global.LOCAL_PLUGINS.PLUGINS;
    }
  },
  addPlugin(plugin) {
    let has = false;
    const currentPlugins = global.LOCAL_PLUGINS.getLocalPlugins();
    currentPlugins.some((p) => {
      has = p.name === plugin.name;
      return has;
    });
    if (!has) {
      currentPlugins.unshift(plugin);
      global.LOCAL_PLUGINS.PLUGINS = currentPlugins;
      fs.writeFileSync(
        configPath,
        JSON.stringify(currentPlugins)
      );
    }
  },
  updatePlugin(plugin) {
    global.LOCAL_PLUGINS.PLUGINS = global.LOCAL_PLUGINS.PLUGINS.map(
      (origin) => {
        if (origin.name === plugin.name) {
          return plugin;
        }
        return origin;
      }
    );
    fs.writeFileSync(configPath, JSON.stringify(global.LOCAL_PLUGINS.PLUGINS));
  },
  async deletePlugin(plugin) {
    await pluginInstance.uninstall([plugin.name], { isDev: plugin.isDev });
    global.LOCAL_PLUGINS.PLUGINS = global.LOCAL_PLUGINS.PLUGINS.filter((p) => plugin.name !== p.name);
    fs.writeFileSync(configPath, JSON.stringify(global.LOCAL_PLUGINS.PLUGINS));
    return global.LOCAL_PLUGINS.PLUGINS;
  },
};
