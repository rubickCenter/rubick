import { app, globalShortcut } from 'electron'
import { autoUpdate } from '../common/utils/autoUpdate'
import createTray from '../common/utils/tray'
import { commonConst } from '../common/utils'
import pkg from '../../package.json'

import {main} from './browsers'

if (commonConst.production()) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// to fix https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false

class InitApp {
  launchApp () {
    this.mainWindow = null
    this.windowCreator = main()
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      console.log(1111)
      this.beforeReady()
      this.onReady()
      this.onRunning()
      this.onQuit()
    }
  }
  init () {
  }

  createWindow () {
    this.windowCreator.init()
  }

  beforeReady () {
    // 系统托盘
    if (commonConst.macOS()) {
      if (commonConst.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder()
      } else {
        app.dock.hide()
      }
    } else {
      app.disableHardwareAcceleration()
    }
  }

  onReady () {
    const readyFunction = () => {
      this.createWindow()
      this.init()
      createTray(this.windowCreator.getWindow())
      autoUpdate()
    }
    if (!app.isReady()) {
      app.on('ready', readyFunction)
    } else {
      readyFunction()
    }
  }

  onRunning () {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      const win = this.windowCreator.getWindow()
      if (win) {
        if (win.isMinimized()) {
          win.restore()
        }
        win.focus()
      }
    })
    app.on('activate', () => {
      if (!this.windowCreator.getWindow()) {
        this.createWindow()
      }
    })
    if (commonConst.windows()) {
      app.setAppUserModelId(pkg.build.appId)
    }
  }

  onQuit () {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('will-quit', () => {
      globalShortcut.unregisterAll()
    })
    // Exit cleanly on request from parent process in development mode.
    if (commonConst.dev()) {
      if (process.platform === 'win32') {
        process.on('message', data => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
  }
}

(new InitApp()).launchApp()
