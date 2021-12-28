const {remote} = require("electron");

window.market = {
  getLocalPlugins() {
    return remote.getGlobal("LOCAL_PLUGINS").getLocalPlugins();
  },
  downloadPlugin(plugin) {
    return remote.getGlobal("LOCAL_PLUGINS").downloadPlugin(plugin);
  },
  deletePlugin(plugin) {
    return remote.getGlobal("LOCAL_PLUGINS").deletePlugin(plugin);
  },
  refreshPlugin(plugin) {
    return remote.getGlobal("LOCAL_PLUGINS").refreshPlugin(plugin);
  },
};
