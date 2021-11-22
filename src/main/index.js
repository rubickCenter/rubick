import { app, globalShortcut } from 'electron'
import init from './common/common'
import { autoUpdate } from './common/autoUpdate'
import createTray from './tray'
import { commonConst } from './common/utils'
import pkg from '../../package.json'
import Store from 'electron-store';

Store.initRenderer()

const { main } = require("./browsers")()

if (commonConst.production()) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// to fix https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false

class initApp {
  launchApp() {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      this.beforeReady()
      this.onReady()
      this.onRunning()
      this.onQuit()
    }
  }

  createWindow() {
    main.init()
    init(main.getWindow())
  }

  beforeReady() {
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

  onReady() {
    const readyFunction = () => {
      this.createWindow()
      createTray(main.getWindow())
      autoUpdate()
    }
    if (!app.isReady()) {
      app.on('ready', readyFunction)
    } else {
      readyFunction()
    }
    // 生产环境禁止刷新
    if (commonConst.production()) {
      app.on("browser-window-focus", function () {
        globalShortcut.register("CommandOrControl+R", () => {});
        globalShortcut.register("F5", () => {});
      });
    }
    // 自定义 CommandOrControl+W，关闭窗口会导致错误
    app.on("browser-window-focus", function () {
      globalShortcut.register("CommandOrControl+W", () => {
        const win = main.getWindow();
        if(win.isVisible()){
          win.hide();
        }
      });
    });
    // 失焦卸载快捷键
    app.on('browser-window-blur', function(){
      if(globalShortcut.isRegistered("CommandOrControl+W"))
        globalShortcut.unregister("CommandOrControl+W");
      if(globalShortcut.isRegistered("CommandOrControl+R"))
        globalShortcut.unregister("CommandOrControl+R");
      if(globalShortcut.isRegistered("F5"))
        globalShortcut.unregister("F5");
    })
  }

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

  onQuit() {
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

(new initApp()).launchApp()
