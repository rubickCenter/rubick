const { BrowserWindow, nativeImage } = require("electron");

module.exports = () => {
  let win;

  let init = () => {
    if (win === null || win === undefined) {
      createWindow();
    }
  };

  let createWindow = () => {
    win = new BrowserWindow({
      frame: false,
      autoHideMenuBar: true,
      width: 100,
      height: 100,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      focusable: true,
      hasShadow: false,
      // icon: nativeImage.createFromPath(`${dirname}/build/icon.png`),
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
