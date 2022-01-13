import { ref, watch } from "vue";
import throttle from "lodash.throttle";
import { remote, ipcRenderer } from "electron";
import pluginClickEvent from "./pluginClickEvent";
import useFocus from "./clipboardWatch";

function formatReg(regStr) {
  const flags = regStr.replace(/.*\/([gimy]*)$/, "$1");
  const pattern = flags.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1");
  return new RegExp(pattern, flags);
}

function searchKeyValues(lists, value, strict = false) {
  return lists.filter((item) => {
    if (typeof item === "string") {
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    }
    if (item.type === "regex" && !strict) {
      return formatReg(item.match).test(value);
    }
    return false;
  });
}

const optionsManager = ({
  searchValue,
  appList,
  openPlugin,
  currentPlugin,
}) => {
  const optionsRef = ref([]);

  // 全局快捷键
  ipcRenderer.on("global-short-key", (e, msg) => {
    const options = getOptionsFromSearchValue(msg, true);
    options[0].click();
  });

  const getOptionsFromSearchValue = (value, strict = false) => {
    const localPlugins = remote.getGlobal("LOCAL_PLUGINS").getLocalPlugins();
    let options: any = [];
    // todo 先搜索 plugin
    localPlugins.forEach((plugin) => {
      const feature = plugin.features;
      // 系统插件无 features 的情况，不需要再搜索
      if (!feature) return;
      feature.forEach((fe) => {
        const cmds = searchKeyValues(fe.cmds, value, strict);
        options = [
          ...options,
          ...cmds.map((cmd) => ({
            name: cmd.label || cmd,
            value: "plugin",
            icon: plugin.logo,
            desc: fe.explain,
            type: plugin.pluginType,
            zIndex: cmd.label ? 0 : 1, // 排序权重
            click: () => {
              pluginClickEvent({
                plugin,
                fe,
                cmd,
                ext: cmd.type
                  ? {
                      code: fe.code,
                      type: cmd.type || "text",
                      payload: searchValue.value,
                    }
                  : null,
                openPlugin,
              });
            },
          })),
        ];
      });
    });
    // todo 再搜索 app
    const appPlugins = appList.value || [];
    const descMap = new Map();
    options = [
      ...options,
      ...appPlugins
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
          return {
            ...plugin,
            zIndex: 1,
            click: () => {
              openPlugin(plugin);
            },
          };
        }),
    ];
    return options;
  };

  watch(searchValue, () => search(searchValue.value));
  // search Input operation
  const search = throttle((value) => {
    if (currentPlugin.value.name) return;
    if (clipboardFile.value.length) return;
    if (!value) {
      optionsRef.value = [];
      return;
    }
    optionsRef.value = getOptionsFromSearchValue(value);
  }, 500);

  const setOptionsRef = (options) => {
    optionsRef.value = options;
  };

  const {
    searchFocus,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent,
  } = useFocus({
    currentPlugin,
    optionsRef,
    openPlugin,
    setOptionsRef,
  });

  return {
    options: optionsRef,
    searchFocus,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent,
  };
};

export default optionsManager;
