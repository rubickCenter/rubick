import { app, globalShortcut } from 'electron'
import '../renderer/store'
import init from './common/common';
import {autoUpdate} from './common/autoUpdate';
import createTray from './tray';
import {commonConst} from './common/utils';
import pkg from '../../package.json';

const {main} = require("./browsers")();

if (commonConst.production()) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// to fix https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false;

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
    main.init();
    init(main.getWindow());
  }

  beforeReady() {
    // 系统托盘
    if (commonConst.macOS()) {
      if (commonConst.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder();
      } else {
        app.dock.hide();
      }
    }else {
      app.disableHardwareAcceleration();
    }
  }

  onReady() {
    const readyFunction = () => {
      this.createWindow();
      createTray(main.getWindow());
      autoUpdate();
    }
    if (!app.isReady()) {
      app.on('ready', readyFunction)
    } else {
      readyFunction()
    }
  }

  onRunning() {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      const win = main.getWindow();
      if (win) {
        if (win.isMinimized()) {
          win.restore();
        }
        win.focus();
      }
    });
    app.on('activate', () => {
      if (!main.getWindow()) {
        this.createWindow();
      }
    });
    if (commonConst.windows()) {
      app.setAppUserModelId(pkg.build.appId);
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

(new initApp()).launchApp();
