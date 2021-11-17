import {BrowserWindow} from 'electron'

export default () => {
  let win

  let init = (url, opts) => {
    if (win === null || win === undefined) {
      createWindow(url, opts)
    }
  }

  let createWindow = (url, opts) => {
    win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 800,
      height: 600,
      alwaysOnTop: true,
      resizable: false,
      focusable: true,
      hasShadow: false,
      show: false,
      webPreferences: {
        webviewTag: true,
        webSecurity: false,
        backgroundThrottling: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: `${__static}/runner/preload.js`
      }
    })
    win.loadURL(`file://${url}?${encodeURIComponent(opts)}`)
    win.on('closed', () => {
      win = undefined
    })
    win.once('ready-to-show', () => {
      win.show()
      win.webContents.send('onPluginEnter', JSON.parse(opts))
    })
    win.webContents.on('dom-ready', () => {
      win.webContents.send('onPluginReady', JSON.parse(opts))
    })
  }

  let getWindow = () => win

  return {
    init,
    getWindow
  }
}
