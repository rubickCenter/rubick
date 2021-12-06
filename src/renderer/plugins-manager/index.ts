import { reactive, toRefs, ref } from "vue";
import { nativeImage, remote, ipcRenderer } from "electron";
import { appSearch, PluginHandler } from "@/core";
import path from "path";
import commonConst from "@/common/utils/commonConst";
import searchManager from "./search";
import optionsManager from "./options";

const appPath = remote.app.getPath("cache");

const createPluginManager = (): any => {
  const baseDir = path.join(appPath, "./rubick-plugins");
  const pluginInstance = new PluginHandler({
    baseDir: baseDir,
  });

  const state: any = reactive({
    appList: [],
    plugins: [],
    localPlugins: [],
    currentPlugin: {},
  });

  const appList = ref([]);

  const initPlugins = async () => {
    appList.value = await appSearch(nativeImage);
  };

  const openPlugin = (plugin) => {
    if (plugin.pluginType === "ui") {
      state.currentPlugin = plugin;
      ipcRenderer.sendSync("msg-trigger", {
        type: "openPlugin",
        plugin: JSON.parse(
          JSON.stringify({
            ...plugin,
            ext: {
              code: plugin.feature.code,
              type: plugin.cmd.type || "text",
              payload: null,
            },
          })
        ),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // document.getElementById("search").value = "";
      // state.searchValue = "";
    }
  };

  const { searchValue, onSearch } = searchManager();
  const { options } = optionsManager({
    searchValue,
    baseDir,
    appList,
    openPlugin,
  });
  // plugin operation
  const getPluginInfo = async ({ pluginName, pluginPath }) => {
    const pluginInfo = await pluginInstance.getAdapterInfo(pluginName, pluginPath);
    return {
      ...pluginInfo,
      indexPath: commonConst.dev()
        ? "http://localhost:8080/#/"
        : `file://${path.join(pluginPath, "../", pluginInfo.main)}`,
    };
  };

  const changeSelect = (select) => {
    state.currentPlugin = select;
  };

  const addPlugin = (plugin: any) => {
    state.plugins.unshift(plugin);
  };

  const removePlugin = (plugin: any) => {
    // todo
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
    options,
    searchValue,
  };
};

export default createPluginManager;
