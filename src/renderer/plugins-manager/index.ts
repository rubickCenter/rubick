import { reactive, toRefs, ref } from "vue";
import { nativeImage, remote, ipcRenderer } from "electron";
import appSearch from "@/core/app-search";
import { PluginHandler } from "@/core";
import path from "path";
import commonConst from "@/common/utils/commonConst";
import { execSync } from "child_process";
import searchManager from "./search";
import optionsManager from "./options";
import { PLUGIN_INSTALL_DIR as baseDir } from "@/common/constans/renderer";

const createPluginManager = (): any => {
  const pluginInstance = new PluginHandler({
    baseDir
  });

  const state: any = reactive({
    appList: [],
    plugins: [],
    localPlugins: [],
    currentPlugin: {},
    pluginLoading: false
  });

  const appList = ref([]);

  const initPlugins = async () => {
    appList.value = await appSearch(nativeImage);
  };

  const loadPlugin = plugin => {
    state.pluginLoading = true;
    state.currentPlugin = plugin;
  };

  const openPlugin = plugin => {
    if (plugin.pluginType === "ui" || plugin.pluginType === "system") {
      if (state.currentPlugin && state.currentPlugin.name === plugin.name) {
        return;
      }
      loadPlugin(plugin);
      ipcRenderer.sendSync("msg-trigger", {
        type: "openPlugin",
        data: JSON.parse(
          JSON.stringify({
            ...plugin,
            ext: plugin.ext || {
              code: plugin.feature.code,
              type: plugin.cmd.type || "text",
              payload: null
            }
          })
        )
      });
      setSearchValue("");
    }
    if (plugin.pluginType === "app") {
      execSync(plugin.action);
    }
  };

  const { searchValue, onSearch, setSearchValue, placeholder } =
    searchManager();
  const {
    options,
    searchFocus,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent
  } = optionsManager({
    searchValue,
    appList,
    openPlugin,
    currentPlugin: toRefs(state).currentPlugin
  });
  // plugin operation
  const getPluginInfo = async ({ pluginName, pluginPath }) => {
    const pluginInfo = await pluginInstance.getAdapterInfo(
      pluginName,
      pluginPath
    );
    return {
      ...pluginInfo,
      icon: pluginInfo.logo,
      indexPath: commonConst.dev()
        ? "http://localhost:8081/#/"
        : `file://${path.join(pluginPath, "../", pluginInfo.main)}`
    };
  };

  const changeSelect = select => {
    state.currentPlugin = select;
  };

  const addPlugin = (plugin: any) => {
    state.plugins.unshift(plugin);
  };

  const removePlugin = (plugin: any) => {
    // todo
  };
  
  window.loadPlugin = plugin => loadPlugin(plugin);

  window.updatePlugin = ({ currentPlugin }: any) => {
    state.currentPlugin = currentPlugin;
    remote.getGlobal("LOCAL_PLUGINS").updatePlugin(currentPlugin);
  };

  window.setCurrentPlugin = ({ currentPlugin }) => {
    state.currentPlugin = currentPlugin;
    setSearchValue("");
  };

  window.initRubick = () => {
    state.currentPlugin = {};
    setSearchValue("");
    window.setSubInput({ placeholder: "" });
  };

  window.pluginLoaded = () => {
    state.pluginLoading = false;
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
    searchFocus,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent
  };
};

export default createPluginManager;
