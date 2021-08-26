const { BrowserWindow } = require("electron")

module.exports = () => {
  let win

  let init = (opts) => {
    createWindow(opts)
  }

  let createWindow = (opts) => {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/#/plugin`
      : `${__dirname}/index.html`
    win = new BrowserWindow({
      height: 600,
      useContentSize: true,
      width: 800,
      titleBarStyle: 'hiddenInset',
      title: '拉比克',
      show: false,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true // 在网页中集成Node
      }
    })
    process.env.NODE_ENV === 'development' ? win.loadURL(winURL) : win.loadFile(winURL, {
      hash: `#/plugin`,
    })

    win.webContents.executeJavaScript(`window.setPluginInfo(${opts})`).then(() => {
      win.show()
    })

    win.on("closed", () => {
      win = undefined
    })
  }

  let getWindow = () => win

  return {
    init: init,
    getWindow: getWindow,
  }
}
