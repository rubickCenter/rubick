import path from "path";
import fs from "fs";
import getLocalDataFile from "./getLocalDataFile";
import { app } from "electron";
import { PluginHandler } from "@/core";

const configPath = path.join(getLocalDataFile(), "./rubick-local-plugin.json");
const appPath = app.getPath("cache");

const baseDir = path.join(appPath, "./rubick-plugins");
const pluginInstance = new PluginHandler({
  baseDir: baseDir,
});

global.LOCAL_PLUGINS = {
  PLUGINS: [],
  async downloadPlugin(plugin) {
    await pluginInstance.install([plugin.name]);
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
    global.LOCAL_PLUGINS.PLUGINS.some((p) => {
      has = p.name === plugin.name;
      return has;
    });
    if (!has) {
      global.LOCAL_PLUGINS.PLUGINS.unshift(plugin);
      fs.writeFileSync(configPath, JSON.stringify(global.LOCAL_PLUGINS.PLUGINS));
    }
  },
};
