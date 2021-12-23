"use strict";
import electron, {
  app,
  globalShortcut,
  protocol,
  BrowserWindow,
} from "electron";
import { main } from "./browsers";
import commonConst from "../common/utils/commonConst";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import API from "./common/api";
import createTray from "./common/tray";
import registerHotKey from "./common/registerHotKey";

import "../common/utils/localPlugin";
import "../common/utils/localConfig";

import registerySystemPlugin from "./common/registerySystemPlugin";

class App {
  private windowCreator: { init: () => void; getWindow: () => BrowserWindow };
  private systemPlugins: any;

  constructor() {
    protocol.registerSchemesAsPrivileged([
      { scheme: "app", privileges: { secure: true, standard: true } },
    ]);
    this.windowCreator = main();
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    } else {
      this.systemPlugins = registerySystemPlugin();
      this.beforeReady();
      this.onReady();
      this.onRunning();
      this.onQuit();
    }
  }

  beforeReady() {
    // 系统托盘
    if (commonConst.macOS()) {
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
    const readyFunction = () => {
      this.createWindow();
      API(this.windowCreator.getWindow());
      // this.init()
      createTray(this.windowCreator.getWindow());
      registerHotKey(this.windowCreator.getWindow());
      this.systemPlugins.triggerReadyHooks(
        Object.assign(electron, { mainWindow: this.windowCreator.getWindow() })
      );
    };
    if (!app.isReady()) {
      app.on("ready", readyFunction);
    } else {
      readyFunction();
    }
  }

  onRunning() {
    app.on("second-instance", () => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      const win = this.windowCreator.getWindow();
      if (win) {
        if (win.isMinimized()) {
          win.restore();
        }
        win.focus();
      }
    });
    app.on("activate", () => {
      if (!this.windowCreator.getWindow()) {
        this.createWindow();
      }
    });
    if (commonConst.windows()) {
      // app.setAppUserModelId(pkg.build.appId)
    }
  }

  onQuit() {
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("will-quit", () => {
      globalShortcut.unregisterAll();
    });

    if (commonConst.dev()) {
      if (process.platform === "win32") {
        process.on("message", (data) => {
          if (data === "graceful-exit") {
            app.quit();
          }
        });
      } else {
        process.on("SIGTERM", () => {
          app.quit();
        });
      }
    }
  }
}

new App();
