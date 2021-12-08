import { BrowserView, BrowserWindow, session } from "electron";
import path from "path";
import commonConst from "../../common/utils/commonConst";

export default () => {
  let view;

  const init = (plugin, window: BrowserWindow) => {
    if (view === null || view === undefined) {
      createView(plugin, window);
    }
  };

  const createView = (plugin, window: BrowserWindow) => {
    const preload =
      commonConst.dev() && plugin.name === "rubick-system-feature"
        ? path.resolve(__static, `../feature/public/preload.js`)
        : path.resolve(plugin.indexPath.replace("file:", ""), `../`, plugin.preload);

    const ses = session.fromPartition("<" + plugin.name + ">");
    ses.setPreloads([`${__static}/preload.js`]);

    view = new BrowserView({
      webPreferences: {
        enableRemoteModule: true,
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
        preload,
        session: ses,
      },
    });
    window.setBrowserView(view);
    view.webContents.loadURL(plugin.indexPath);
    window.once("ready-to-show", () => {
      view.setBounds({ x: 0, y: 60, width: 800, height: 600 });
      view.setAutoResize({ width: true });
      window.setSize(800, 660);
      view.webContents.openDevTools();
      executeHooks("PluginEnter", plugin.ext);
      executeHooks("PluginReady", plugin.ext);
    });
  };

  const removeView = (window: BrowserWindow) => {
    if (!view) return;
    window.removeBrowserView(view);
    window.setSize(800, 60);
    executeHooks("PluginOut", null);
    window.webContents.executeJavaScript(`window.initRubick()`);
    view = undefined;
  };

  const getView = () => view;

  const executeHooks = (hook, data) => {
    if (!view) return;
    const evalJs = `if(window.rubick && window.rubick.hooks && typeof window.rubick.hooks.on${hook} === 'function' ) {     
          try { 
            window.rubick.hooks.on${hook}(${data ? JSON.stringify(data) : ""});
          } catch(e) {} 
        }
      `;
    view.webContents.executeJavaScript(evalJs);
  };

  return {
    init,
    getView,
    removeView,
    executeHooks,
  };
};
