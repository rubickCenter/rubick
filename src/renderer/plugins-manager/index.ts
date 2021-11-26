import { reactive, toRefs } from "vue";
import { nativeImage, remote } from "electron";
import { appSearch, PluginHandler } from "@/core";
import path from "path";

const appPath = remote.app.getPath("cache");

const createPluginManager = (): any => {
  const baseDir = path.join(appPath, "./rubick-plugins");
  const pluginInstance = new PluginHandler({
    baseDir: baseDir,
  });

  const state: any = reactive({
    appList: [],
    plugins: [],
  });

  const initPlugins = async () => {
    state.appList = await appSearch(nativeImage);
  };

  const addPlugin = (plugin: any) => {
    state.plugins.unshift(plugin);
  };

  const removePlugin = (plugin: any) => {
    // todo
  };

  const searchPlugin = () => {
    // todo 先搜索 plugin
    // todo 再搜索 app
  };

  const getPluginInfo = async ({ pluginName, pluginPath }) => {
    const pluginInfo = await pluginInstance.getAdapterInfo(pluginName, pluginPath);
    return {
      ...pluginInfo,
      indexPath: path.join(pluginPath, "../", pluginInfo.main),
    };
  };

  return {
    ...toRefs(state),
    initPlugins,
    addPlugin,
    removePlugin,
    searchPlugin,
    getPluginInfo,
  };
};

export default createPluginManager;
