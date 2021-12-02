const {remote} = require("electron");
console.log(remote)
window.rubick = {
  getLocalPlugins() {
    return remote.getGlobal("LOCAL_PLUGINS").getLocalPlugins();
  },
  downloadPlugin(plugin) {
    return remote.getGlobal("LOCAL_PLUGINS").downloadPlugin(plugin);
  },
};
