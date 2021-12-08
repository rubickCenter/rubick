import { ref, toRaw, toRefs, watch } from "vue";
import throttle from "lodash.throttle";
import { remote } from "electron";
import path from "path";

function searchKeyValues(lists, value) {
  return lists.filter((item) => {
    if (typeof item === "string") {
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    }
    return item.type.toLowerCase().indexOf(value.toLowerCase()) >= 0;
  });
}

const optionsManager = ({ searchValue, baseDir, appList, openPlugin, currentPlugin }) => {
  const optionsRef = ref([]);

  watch(searchValue, () => search(searchValue.value));
  // search Input operation
  const search = throttle((value) => {
    if (currentPlugin.value.name) return;
    if (!value) return;
    const localPlugins = remote.getGlobal("LOCAL_PLUGINS").getLocalPlugins();
    let options: any = [];
    // todo 先搜索 plugin
    localPlugins.forEach((plugin) => {
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
                baseDir,
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
          plugin.click = () => {
            openPlugin(plugin);
          };
          return plugin;
        }),
    ];
    optionsRef.value = options;
  }, 500);

  return {
    options: optionsRef,
  };
};

export default optionsManager;
