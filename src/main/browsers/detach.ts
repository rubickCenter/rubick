import { BrowserWindow, ipcMain, nativeTheme } from 'electron';
import localConfig from '../common/initLocalConfig';
import path from 'path';
export default () => {
  let win: any;

  const init = (pluginInfo, viewInfo, view) => {
    ipcMain.on('detach:service', async (event, arg: { type: string }) => {
      const data = await operation[arg.type]();
      event.returnValue = data;
    });
    createWindow(pluginInfo, viewInfo, view);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@electron/remote/main').enable(win.webContents);
  };

  const createWindow = async (pluginInfo, viewInfo, view) => {
    win = new BrowserWindow({
      height: viewInfo.height,
      width: viewInfo.width,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 12, y: 21 },
      title: pluginInfo.pluginName,
      resizable: true,
      frame: true,
      show: false,
      enableLargerThanScreen: true,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c28' : '#fff',
      x: viewInfo.x,
      y: viewInfo.y,
      webPreferences: {
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        devTools: true,
        nodeIntegration: true,
      },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL('http://localhost:8082');
    } else {
      win.loadURL(`file://${path.join(__static, './detach/index.html')}`);
    }
    win.on('close', () => {
      executeHooks('PluginOut', null);
    });
    win.on('closed', () => {
      win = undefined;
    });

    win.once('ready-to-show', async () => {
      const config = await localConfig.getConfig();
      const darkMode = config.perf.common.darkMode;
      darkMode &&
        win.webContents.executeJavaScript(
          `document.body.classList.add("dark");window.rubick.theme="dark"`
        );
      win.setBrowserView(view);
      win.webContents.executeJavaScript(
        `window.initDetach(${JSON.stringify(pluginInfo)})`
      );
      win.show();
    });
    const executeHooks = (hook, data) => {
      if (!view) return;
      const evalJs = `console.log(window.rubick);if(window.rubick && window.rubick.hooks && typeof window.rubick.hooks.on${hook} === 'function' ) {
          try {
            window.rubick.hooks.on${hook}(${data ? JSON.stringify(data) : ''});
          } catch(e) {console.log(e)}
        }
      `;
      view.webContents.executeJavaScript(evalJs);
    };
  };

  const getWindow = () => win;

  const operation = {
    minimize: () => {
      win.focus();
      win.minimize();
    },
    maximize: () => {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close: () => {
      win.close();
    },
  };

  return {
    init,
    getWindow,
  };
};
