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
      width: 850,
      height: 700,
      alwaysOnTop: true,
      focusable: true,
      show: false,
      webPreferences: {
        enableRemoteModule: true,
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
        preload: `${__static}/preload.js`,
      },
    });
    win.loadURL(plugin.indexPath);

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
