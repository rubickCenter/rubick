const { BrowserWindow, ipcMain, globalShortcut } = require("electron");
const os = require('os')
const path = require('path')

module.exports = () => {
  let captureWins = []

  let init = () => {
    if (captureWins.length) {
      return
    }
    createWindow();
  };

  let createWindow = () => {
    const { screen } = require('electron');
    let displays = screen.getAllDisplays();
    captureWins = displays.map((display) => {
      let captureWin = new BrowserWindow({
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        fullscreen: os.platform() === 'win32' || undefined,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        transparent: true,
        frame: false,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true,
        hasShadow: false,
        show: false,
        webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true,
          webSecurity: false,
          // devTools: false,
        }
      })
      captureWin.setAlwaysOnTop(true, 'screen-saver')
      captureWin.setVisibleOnAllWorkspaces(true)
      captureWin.setFullScreenable(false)

      captureWin.loadFile(`${__static}/plugins/capture/index.html`);

      let { x, y } = screen.getCursorScreenPoint()
      if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
        captureWin.focus()
      } else {
        captureWin.blur()
      }

      captureWin.once('ready-to-show', () => captureWin.show());
      return captureWin
    });
  };

  let getWindow = () => captureWins;

  let useCapture = () => {
    globalShortcut.register('Esc', () => {
      if (captureWins) {
        captureWins.forEach(win => win.close())
        captureWins = []
      }
    });

    globalShortcut.register('CmdOrCtrl+Shift+S', init)

    ipcMain.on('capture-screen', (e, { type = 'start', screenId, winId, x, y } = {}) => {
      if (type === 'start') {
        init()
      } else if (type === 'complete') {
        if (captureWins) {
          captureWins.forEach(win => win.close())
          captureWins = []
        }
        // nothing
      } else if (type === 'select') {
        captureWins.forEach(win => win.webContents.send('capture-screen', { type: 'select', screenId }))
      } else if (type === 'getAllDisplays') {
        const { screen } = require('electron');
        let displays = screen.getAllDisplays();
        const currentScreen = displays.filter(d => d.bounds.x === x && d.bounds.y === y)[0];
        e.sender.send('getAllDisplays', {
          screen: {
            scaleFactor: currentScreen.scaleFactor,
            id: currentScreen.id,
            bounds: currentScreen.bounds,
          },
          winId,
        });
      }
    });
  }

  return {
    init: init,
    getWindow: getWindow,
    useCapture,
  };
};
