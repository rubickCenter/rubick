import {BrowserWindow} from 'electron'

export default () => {
  let win

  let init = (url) => {
    if (win === null || win === undefined) {
      createWindow(url)
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
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: `${__static}/runner/preload.js`
      }
    })
    win.loadURL(`file://${url}`)
    win.on('closed', () => {
      win = undefined
    })
    console.log(opts)
    win.webContents
      .executeJavaScript(`window.rubick.setPluginInfo(${opts})`)
      .then(() => {
        win.show()
      })

    win.once('ready-to-show', () => win.show())
  }

  let getWindow = () => win

  return {
    init,
    getWindow
  }
}
