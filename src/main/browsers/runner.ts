import { app, BrowserWindow } from "electron";

export default () => {
  let win;

  const init = (plugin) => {
    if (win === null || win === undefined) {
      createWindow(plugin);
    }
  };

  const createWindow = (plugin) => {
    win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 800,
      height: 800,
      alwaysOnTop: true,
      resizable: false,
      focusable: true,
      show: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
      },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL("http://localhost:8081" as string);
    } else {
      // Load the index.html when not in development
      win.loadURL(`file://${__static}/runner/index.html`);
    }
    win.webContents.on("dom-ready", () => {
      win.webContents.executeJavaScript(`window.setPluginInfo(${JSON.stringify(plugin)})`);
    });

    win.once("ready-to-show", () => {
      win.show();
    });

    win.on("closed", () => {
      win = undefined;
    });
  };

  const getWindow = () => win;

  return {
    init,
    getWindow,
  };
};
