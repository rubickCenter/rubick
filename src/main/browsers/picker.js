const { BrowserWindow, nativeImage } = require("electron");

module.exports = () => {
  let win;

  let init = (x, y) => {
    if (win === null || win === undefined) {
      createWindow();
    }
  };

  let createWindow = () => {
    win = new BrowserWindow({
      frame: false,
      autoHideMenuBar: true,
      width: 108,
      height: 108,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      focusable: true,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: true,
        devTools: false,
      },
    });

    win.loadURL(`file://${__static}/plugins/picker/index.html`);
    win.on("closed", () => {
      win = undefined;
    });
  };

  let getWindow = () => win;

  return {
    init: init,
    getWindow: getWindow,
  };
};
