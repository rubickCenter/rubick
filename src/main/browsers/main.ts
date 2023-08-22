import { app, BrowserWindow, protocol, nativeTheme } from 'electron';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import versonHandler from '../common/versionHandler';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize();

export default () => {
  let win: any;

  const init = () => {
    createWindow();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@electron/remote/main').enable(win.webContents);
  };

  const createWindow = async () => {
    win = new BrowserWindow({
      height: 60,
      useContentSize: true,
      resizable: true,
      width: 800,
      frame: false,
      title: '拉比克',
      show: false,
      skipTaskbar: true,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c28' : '#fff',
      webPreferences: {
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true,
        preload: path.join(__static, 'preload.js'),
      },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      win.loadURL('app://./index.html');
    }
    protocol.interceptFileProtocol('image', (req, callback) => {
      const url = req.url.substr(8);
      callback(decodeURI(url));
    });
    win.on('closed', () => {
      win = undefined;
    });

    win.on('show', () => {
      win.webContents.executeJavaScript(
        `window.rubick && window.rubick.hooks && typeof window.rubick.hooks.onShow === "function" && window.rubick.hooks.onShow()`
      );
      versonHandler.checkUpdate();
      // win.webContents.openDevTools();
    });

    win.on('hide', () => {
      win.webContents.executeJavaScript(
        `window.rubick && window.rubick.hooks && typeof window.rubick.hooks.onHide === "function" && window.rubick.hooks.onHide()`
      );
    });

    // 判断失焦是否隐藏
    win.on('blur', () => {
      const config = { ...global.OP_CONFIG.get() };
      if (config.perf.common.hideOnBlur) {
        win.hide();
      }
    });
  };

  const getWindow = () => win;

  return {
    init,
    getWindow,
  };
};
