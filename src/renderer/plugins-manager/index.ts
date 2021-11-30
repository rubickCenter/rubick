import { reactive, toRefs, nextTick } from "vue";
import { nativeImage, remote } from "electron";
import { appSearch, PluginHandler } from "@/core";
import path from "path";
import throttle from "lodash.throttle";

const appPath = remote.app.getPath("cache");

const createPluginManager = (): any => {
  const baseDir = path.join(appPath, "./rubick-plugins");
  const pluginInstance = new PluginHandler({
    baseDir: baseDir,
  });

  const state: any = reactive({
    appList: [],
    plugins: [],
    options: [],
    searchValue: "",
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

  const onSearch = throttle((e) => {
    const value = e.target.value;
    state.searchValue = value;
    if (!value) return;
    // todo 先搜索 plugin
    // todo 再搜索 app
    let options: any = [];
    const descMap = new Map();
    options = [
      ...options,
      ...state.appList
        .filter((plugin) => {
          if (!descMap.get(plugin)) {
            descMap.set(plugin, true);
            let has = false;
            plugin.keyWords.some((keyWord) => {
              if (
                keyWord
                  .toLocaleUpperCase()
                  .indexOf(value.toLocaleUpperCase()) >= 0
              ) {
                has = keyWord;
                plugin.name = keyWord;
                return true;
              }
              return false;
            });
            return has;
          } else {
            return false;
          }
        })
        .map((plugin) => {
          plugin.click = () => {
            _openPlugin({ plugin });
          };
          return plugin;
        }),
    ];
    state.options = options;
  }, 500);

  const getPluginInfo = async ({ pluginName, pluginPath }) => {
    const pluginInfo = await pluginInstance.getAdapterInfo(pluginName, pluginPath);
    return {
      ...pluginInfo,
      indexPath: path.join(pluginPath, "../", pluginInfo.main),
    };
  };

  const _openPlugin = ({ plugin }) => {
    //
  };

  return {
    ...toRefs(state),
    initPlugins,
    addPlugin,
    removePlugin,
    onSearch,
    getPluginInfo,
  };
};

export default createPluginManager;
