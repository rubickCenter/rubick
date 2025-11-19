import { BrowserView, BrowserWindow, session } from 'electron';
import path from 'path';
import commonConst from '../../common/utils/commonConst';
import { PLUGIN_INSTALL_DIR as baseDir } from '@/common/constans/main';
import localConfig from '@/main/common/initLocalConfig';
import {
  WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT,
  WINDOW_WIDTH,
} from '@/common/constans/common';

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
    window.setSize(WINDOW_WIDTH, height || WINDOW_PLUGIN_HEIGHT);
    view.setBounds({
      x: 0,
      y: WINDOW_HEIGHT,
      width: WINDOW_WIDTH,
      height: height || WINDOW_PLUGIN_HEIGHT - WINDOW_HEIGHT,
    });
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
    if (view === null || view === undefined || view.inDetach) {
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
    executeHooks('PluginOut', null);
    // 先记住这次要移除的视图，防止后面异步代码里全局引用被换掉
    const snapshotView = view;
    setTimeout(() => {
      // 获取当前视图，判断是否已经换成了新视图
      const currentView = window.getBrowserView?.();
      window.removeBrowserView(snapshotView);

      // 主窗口的插件视图仍然挂着旧实例时，需要还原主窗口 UI
      if (!snapshotView.inDetach) {
        // 如果窗口还挂着旧视图，说明还没换掉，需要把主窗口恢复到初始状态
        if (currentView === snapshotView) {
          window.setBrowserView(null);
          if (view === snapshotView) {
            window.webContents?.executeJavaScript(`window.initRubick()`);
            view = undefined;
          }
        }
        snapshotView.webContents?.destroy();
      }
      // 分离窗口只需释放全局引用，视图由分离窗口继续管理
      else if (view === snapshotView) {
        view = undefined;
      }
    }, 0);
  };

  const getView = () => view;

  const executeHooks = (hook, data) => {
    if (!view) return;
    const evalJs = `if(window.rubick && window.rubick.hooks && typeof window.rubick.hooks.on${hook} === 'function' ) {
          try {
            window.rubick.hooks.on${hook}(${data ? JSON.stringify(data) : ''});
          } catch(e) {}
        }
      `;
    view.webContents?.executeJavaScript(evalJs);
  };

  return {
    init,
    getView,
    removeView,
    executeHooks,
  };
};
