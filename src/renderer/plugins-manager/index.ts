import { reactive, toRefs, toRaw } from "vue";
import { nativeImage, remote, ipcRenderer } from "electron";
import { appSearch, PluginHandler } from "@/core";
import path from "path";
import throttle from "lodash.throttle";
import commonConst from "@/common/utils/commonConst";

const appPath = remote.app.getPath("cache");

function searchKeyValues(lists, value) {
  return lists.filter((item) => {
    if (typeof item === "string") {
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    }
    return item.type.toLowerCase().indexOf(value.toLowerCase()) >= 0;
  });
}

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
    localPlugins: [],
    currentPlugin: {},
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
    state.localPlugins = remote.getGlobal("LOCAL_PLUGINS").getLocalPlugins();
    let options: any = [];
    // todo 先搜索 plugin
    state.localPlugins.forEach((plugin) => {
      const feature = plugin.features;
      feature.forEach((fe) => {
        const cmds = searchKeyValues(fe.cmds, value);
        options = [
          ...options,
          ...cmds.map((cmd) => ({
            name: cmd,
            value: "plugin",
            icon: plugin.logo,
            desc: fe.explain,
            type: plugin.pluginType,
            click: () => {
              const pluginPath = path.resolve(
                pluginInstance.baseDir,
                "node_modules",
                plugin.name
              );
              openPlugin({
                ...toRaw(plugin),
                indexPath: `file://${path.join(
                  pluginPath,
                  "./",
                  plugin.main
                )}`,
                cmd,
                feature: fe,
              });
            },
          })),
        ];
      });
    });
    // todo 再搜索 app
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
            openPlugin(plugin);
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
      indexPath: commonConst.dev()
        ? "http://localhost:8080/#/"
        : `file://${path.join(pluginPath, "../", pluginInfo.main)}`,
    };
  };

  const openPlugin = (plugin) => {
    if (plugin.pluginType === "ui") {
      state.currentPlugin = plugin;
      ipcRenderer.sendSync("msg-trigger", {
        type: "openPlugin",
        plugin: JSON.parse(JSON.stringify(plugin)),
      });
    }
  };

  const changeSelect = (select) => {
    state.currentPlugin = select;
  };

  return {
    ...toRefs(state),
    initPlugins,
    addPlugin,
    removePlugin,
    onSearch,
    getPluginInfo,
    openPlugin,
    changeSelect,
  };
};

export default createPluginManager;
