import { BrowserView, BrowserWindow, session } from 'electron';
import path from 'path';
import commonConst from '../../common/utils/commonConst';
import { PLUGIN_INSTALL_DIR as baseDir } from '@/common/constans/main';
import localConfig from '@/main/common/initLocalConfig';

const getRelativePath = (indexPath) => {
  return commonConst.windows()
    ? indexPath.replace('file://', '')
    : indexPath.replace('file:', '');
};

const getPreloadPath = (plugin, pluginIndexPath) => {
  const { name, preload, tplPath, indexPath } = plugin;
  if (!preload) return;
  if (commonConst.dev()) {
    if (name === 'rubick-system-feature') {
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

const viewPoolManager = () => {
  const viewPool: any = {
    views: [],
  };
  const maxLen = 4;
  return {
    getView(pluginName) {
      return viewPool.views.find((view) => view.pluginName === pluginName);
    },
    addView(pluginName, view) {
      if (this.getView(pluginName)) return;
      if (viewPool.views.length > maxLen) {
        viewPool.views.shift();
      }
      viewPool.views.push({
        pluginName,
        view,
      });
    },
  };
};

export default () => {
  let view;
  const viewInstance = viewPoolManager();

  const viewReadyFn = async (window, { pluginSetting, ext }) => {
    if (!view) return;
    const height = pluginSetting && pluginSetting.height;
    window.setSize(800, height || 600);
    view.setBounds({ x: 0, y: 60, width: 800, height: height || 540 });
    view.setAutoResize({ width: true, height: true });
    executeHooks('PluginEnter', ext);
    executeHooks('PluginReady', ext);
    const config = await localConfig.getConfig();
    const darkMode = config.perf.common.darkMode;
    darkMode &&
      view.webContents.executeJavaScript(
        `document.body.classList.add("dark");window.rubick.theme="dark"`
      );
    window.webContents.executeJavaScript(`window.pluginLoaded()`);
  };

  const init = (plugin, window: BrowserWindow) => {
    if (view === null || view === undefined) {
      createView(plugin, window);
      // if (viewInstance.getView(plugin.name) && !commonConst.dev()) {
      //   view = viewInstance.getView(plugin.name).view;
      //   window.setBrowserView(view);
      //   view.inited = true;
      //   viewReadyFn(window, plugin);
      // } else {
      //   createView(plugin, window);
      //   viewInstance.addView(plugin.name, view);
      // }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@electron/remote/main').enable(view.webContents);
    }
  };

  const createView = (plugin, window: BrowserWindow) => {
    const {
      tplPath,
      indexPath,
      development,
      name,
      main = 'index.html',
      pluginSetting,
      ext,
    } = plugin;
    let pluginIndexPath = tplPath || indexPath;
    let preloadPath;
    let darkMode;
    // 开发环境
    if (commonConst.dev() && development) {
      pluginIndexPath = development;
      const pluginPath = path.resolve(baseDir, 'node_modules', name);
      preloadPath = `file://${path.join(pluginPath, './', main)}`;
    }
    // 再尝试去找
    if (plugin.name === 'rubick-system-feature' && !pluginIndexPath) {
      pluginIndexPath = commonConst.dev()
        ? 'http://localhost:8081/#/'
        : `file://${__static}/feature/index.html`;
    }
    if (!pluginIndexPath) {
      const pluginPath = path.resolve(baseDir, 'node_modules', name);
      pluginIndexPath = `file://${path.join(pluginPath, './', main)}`;
    }
    const preload = getPreloadPath(plugin, preloadPath || pluginIndexPath);

    const ses = session.fromPartition('<' + name + '>');
    ses.setPreloads([`${__static}/preload.js`]);

    view = new BrowserView({
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
        preload,
        session: ses,
        defaultFontSize: 14,
        defaultFontFamily: {
          standard: 'system-ui',
          serif: 'system-ui',
        },
        spellcheck: false,
      },
    });
    window.setBrowserView(view);
    view.webContents.loadURL(pluginIndexPath);
    view.webContents.once('dom-ready', () => viewReadyFn(window, plugin));
    // 修复请求跨域问题
    view.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        callback({
          requestHeaders: { referer: '*', ...details.requestHeaders },
        });
      }
    );

    view.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            'Access-Control-Allow-Origin': ['*'],
            ...details.responseHeaders,
          },
        });
      }
    );
  };

  const removeView = (window: BrowserWindow) => {
    if (!view) return;
    window.removeBrowserView(view);
    if (!view.inDetach) {
      window.setBrowserView(null);
      view.webContents?.destroy();
    }

    // window.setSize(800, 60);
    executeHooks('PluginOut', null);
    window.webContents?.executeJavaScript(`window.initRubick()`);
    view = undefined;
  };

  const getView = () => view;

  const executeHooks = (hook, data) => {
    setTimeout(() => {
      if (!view) return;
      const evalJs = `if(window.rubick && window.rubick.hooks && typeof window.rubick.hooks.on${hook} === 'function' ) {
          try {
            window.rubick.hooks.on${hook}(${data ? JSON.stringify(data) : ''});
          } catch(e) {}
        }
      `;
      view.webContents?.executeJavaScript(evalJs);
    }, 300);
  };

  return {
    init,
    getView,
    removeView,
    executeHooks,
  };
};
