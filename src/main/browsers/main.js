import {app, BrowserWindow, protocol} from 'electron'
const remoteMain = require('@electron/remote/main')

remoteMain.initialize()

export default () => {
  let win

  let init = (opts) => {
    createWindow(opts)
  }

  let createWindow = (opts) => {
    const winURL =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`

    win = new BrowserWindow({
      height: 600,
      useContentSize: true,
      resizable: true,
      width: 800,
      frame: false,
      title: '拉比克',
      show: false,
      skipTaskbar: true,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true
      }
    })

    remoteMain.enable(win.webContents)

    win.loadURL(winURL)

    protocol.interceptFileProtocol(
      'image',
      (req, callback) => {
        const url = req.url.substr(8)
        callback(decodeURI(url))
      },
      (error) => {
        if (error) {
          console.error('Failed to register protocol')
        }
      }
    )

    win.once('ready-to-show', () => {
      win.show()
      // 非隐藏式启动需要显示主窗口
      if (!app.getLoginItemSettings().wasOpenedAsHidden) {
        win.show()
      }
    })
    win.on('closed', () => {
      win = undefined
    })

    // 判断失焦是否隐藏
    win.on('blur', () => {
      app.isPackaged && win.hide()
    })
  }

  let getWindow = () => win

  return {
    init,
    getWindow
  }
}
