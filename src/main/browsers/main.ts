import { app, BrowserWindow, protocol } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
export default () => {
  let win: any;

  const init = () => {
    createWindow();
  };

  const createWindow = async () => {
    win = new BrowserWindow({
      height: 60,
      useContentSize: true,
      resizable: true,
      width: 800,
      frame: false,
      title: "拉比克",
      show: false,
      skipTaskbar: true,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true,
      },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      win.loadURL("app://./index.html");
    }
    protocol.interceptFileProtocol("image", (req, callback) => {
      const url = req.url.substr(8);
      callback(decodeURI(url));
    });
    win.on("closed", () => {
      win = undefined;
    });

    // 判断失焦是否隐藏
    win.on("blur", () => {
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
