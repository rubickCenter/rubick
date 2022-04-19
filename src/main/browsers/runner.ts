import { BrowserView, BrowserWindow, session } from "electron";
import path from "path";
import commonConst from "../../common/utils/commonConst";
import { PLUGIN_INSTALL_DIR as baseDir } from "@/common/constans/main";

const getRelativePath = indexPath => {
  return commonConst.windows()
    ? indexPath.replace("file://", "")
    : indexPath.replace("file:", "");
};

const getPreloadPath = (plugin, pluginIndexPath) => {
  const { name, preload, tplPath, indexPath } = plugin;
  if (!preload) return;
  if (commonConst.dev()) {
    if (name === "rubick-system-feature") {
      return path.resolve(__static, `../feature/public/preload.js`);
    }
    if (tplPath) {
      return path.resolve(getRelativePath(indexPath), `./`, preload);
    }
    return path.resolve(getRelativePath(pluginIndexPath), `../`, preload);
  }
  if (tplPath) {
    return path.resolve(getRelativePath(indexPath), `./`, preload);
  }
  return path.resolve(getRelativePath(pluginIndexPath), `../`, preload);
};

export default () => {
  let view;

  const init = (plugin, window: BrowserWindow) => {
    if (view === null || view === undefined) {
      createView(plugin, window);
    }
  };

  const createView = (plugin, window: BrowserWindow) => {
    let pluginIndexPath = plugin.tplPath || plugin.indexPath;
    if (!pluginIndexPath) {
      const pluginPath = path.resolve(baseDir, "node_modules", plugin.name);
      pluginIndexPath = `file://${path.join(pluginPath, "./", plugin.main)}`;
    }
    const preload = getPreloadPath(plugin, pluginIndexPath);

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
        session: ses
      }
    });
    window.setBrowserView(view);
    view.webContents.loadURL(pluginIndexPath);
    view.webContents.once("dom-ready", () => {
      window.setSize(800, 660);
      view.setBounds({ x: 0, y: 60, width: 800, height: 600 });
      view.setAutoResize({ width: true });
      executeHooks("PluginEnter", plugin.ext);
      executeHooks("PluginReady", plugin.ext);
      window.webContents.executeJavaScript(`window.pluginLoaded()`);
    });
    // 修复请求跨域问题
    view.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        callback({
          requestHeaders: { referer: "*", ...details.requestHeaders }
        });
      }
    );

    view.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            "Access-Control-Allow-Origin": ["*"],
            ...details.responseHeaders
          }
        });
      }
    );
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
    executeHooks
  };
};
