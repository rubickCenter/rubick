'use strict';
import electron, {
  app,
  globalShortcut,
  protocol,
  BrowserWindow,
} from 'electron';
import { main, guide } from './browsers';
import commonConst from '../common/utils/commonConst';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import API from './common/api';
import createTray from './common/tray';
import registerHotKey from './common/registerHotKey';
import localConfig from './common/initLocalConfig';
import {
  getSearchFiles,
  putFileToRubick,
  macBeforeOpen,
} from './common/getSearchFiles';

import '../common/utils/localPlugin';

import checkVersion from './common/versionHandler';
import registerSystemPlugin from './common/registerSystemPlugin';

class App {
  public windowCreator: { init: () => void; getWindow: () => BrowserWindow };
  private systemPlugins: any;

  constructor() {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } },
    ]);
    this.windowCreator = main();
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    } else {
      this.systemPlugins = registerSystemPlugin();
      this.beforeReady();
      this.onReady();
      this.onRunning();
      this.onQuit();
    }
  }
  beforeReady() {
    // 系统托盘
    if (commonConst.macOS()) {
      macBeforeOpen();
      if (commonConst.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder();
      } else {
        app.dock.hide();
      }
    } else {
      app.disableHardwareAcceleration();
    }
  }

  createWindow() {
    this.windowCreator.init();
  }
  onReady() {
    const readyFunction = async () => {
      checkVersion();
      await localConfig.init();
      const config = await localConfig.getConfig();
      if (!config.perf.common.guide) {
        guide().init();
        config.perf.common.guide = true;
        localConfig.setConfig(config);
      }
      this.createWindow();
      const mainWindow = this.windowCreator.getWindow();
      API.init(mainWindow);
      createTray(this.windowCreator.getWindow());
      registerHotKey(this.windowCreator.getWindow());
      this.systemPlugins.triggerReadyHooks(
        Object.assign(electron, {
          mainWindow: this.windowCreator.getWindow(),
          API,
        })
      );
    };
    if (!app.isReady()) {
      app.on('ready', readyFunction);
    } else {
      readyFunction();
    }
  }

  onRunning() {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      const files = getSearchFiles(commandLine, workingDirectory);
      const win = this.windowCreator.getWindow();
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      // 如果有文件列表作为参数，说明是命令行启动
      if (win) {
        if (win.isMinimized()) {
          win.restore();
        }
        win.focus();
        if (files.length > 0) {
          win.show();
          putFileToRubick(win.webContents, files);
        }
      }
    });
    app.on('activate', () => {
      if (!this.windowCreator.getWindow()) {
        this.createWindow();
      }
    });
    if (commonConst.windows()) {
      // app.setAppUserModelId(pkg.build.appId)
    }
  }

  onQuit() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('will-quit', () => {
      globalShortcut.unregisterAll();
    });

    if (commonConst.dev()) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit();
          }
        });
      } else {
        process.on('SIGTERM', () => {
          app.quit();
        });
      }
    }
  }
}

export default new App();
