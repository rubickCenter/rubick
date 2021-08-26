import { app, globalShortcut } from 'electron'
import '../renderer/store'
import init from './common/common'
import { autoUpdate } from './common/autoUpdate'
import createTray from './tray'
const { main } = require("./browsers")()
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

function createWindow() {
  main.init()
  init(main.getWindow())
}

app.on('ready', () => {
  createWindow()
  createTray(main.getWindow())
  autoUpdate()
})

onRunning() {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    const win = main.getWindow()
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })
  app.on('activate', () => {
    if (!main.getWindow()) {
      this.createWindow()
    }
  })
  if (commonConst.windows()) {
    app.setAppUserModelId(pkg.build.appId)
  }
}

app.on('activate', () => {
  createWindow()
})

  (new initApp()).launchApp()
