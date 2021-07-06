const { BrowserWindow, ipcMain, app } = require("electron");

module.exports = () => {
  let win;

  let init = (mainWindow) => {
    if (win === null || win === undefined) {
      createWindow();
      ipcMain.on('superPanel-hidden', () => {
        win.hide();
      });
      ipcMain.on('superPanel-setSize', (e, height) => {
        win.setSize(250, height);
      });
      ipcMain.on('superPanel-openPlugin', (e, args) => {
        mainWindow.webContents.send('superPanel-openPlugin', args);
      });
    }
  };

  let createWindow = () => {
    win = new BrowserWindow({
      frame: false,
      autoHideMenuBar: true,
      width: 250,
      height: 50,
      show: false,
      alwaysOnTop: true,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        nodeIntegration: true,
        devTools: false,
      },
    });
    win.loadURL(`file://${__static}/plugins/superPanel/index.html`);
    win.once('ready-to-show', () => win.show());
    win.on("closed", () => {
      win = undefined;
    });
    // 打包后，失焦隐藏
    win.on('blur', () => {
      win.hide();
    });
  };

  let getWindow = () => win;

  return {
    init: init,
    getWindow: getWindow,
  };
};
