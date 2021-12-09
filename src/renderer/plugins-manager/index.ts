import { reactive, toRefs, ref } from "vue";
import { nativeImage, remote, ipcRenderer } from "electron";
import { appSearch, PluginHandler } from "@/core";
import path from "path";
import commonConst from "@/common/utils/commonConst";
import { execSync } from "child_process";
import searchManager from "./search";
import optionsManager from "./options";
import { PLUGIN_INSTALL_DIR as baseDir } from "@/common/constans/renderer";

const createPluginManager = (): any => {
  const pluginInstance = new PluginHandler({
    baseDir,
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
      setSearchValue("");
    }
    if (plugin.pluginType === "app") {
      execSync(plugin.action);
    }
  };

  const { searchValue, onSearch, setSearchValue, placeholder } = searchManager();
  const { options } = optionsManager({
    searchValue,
    appList,
    openPlugin,
    currentPlugin: toRefs(state).currentPlugin,
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
  window.updatePlugin = ({ currentPlugin }: any) => {
    state.currentPlugin = currentPlugin;
    remote.getGlobal("LOCAL_PLUGINS").updatePlugin(currentPlugin);
  };

  window.setCurrentPlugin = ({ currentPlugin }) => {
    console.log(currentPlugin);
    state.currentPlugin = currentPlugin;
    setSearchValue("");
  };

  window.initRubick = () => {
    state.currentPlugin = {};
    setSearchValue("");
    window.setSubInput({ placeholder: "" });
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
    placeholder,
  };
};

export default createPluginManager;
