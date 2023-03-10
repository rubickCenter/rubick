import {
  BrowserWindow,
  ipcMain,
  dialog,
  app,
  Notification,
  nativeImage,
  clipboard,
  shell
} from "electron";
import { runner, detach } from "../browsers";
import fs from "fs";
import { LocalDb } from "@/core";
import plist from "plist";
import { DECODE_KEY } from "@/common/constans/main";
import mainInstance from "../index";
const runnerInstance = runner();
const detachInstance = detach();
const dbInstance = new LocalDb(app.getPath("userData"));

dbInstance.init();

class API {
  public currentPlugin: null | any = null;
  private DBKEY = "RUBICK_DB_DEFAULT";

  init(mainWindow: BrowserWindow) {
    // 响应 preload.js 事件
    ipcMain.on("msg-trigger", async (event, arg) => {
      const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
      const data = await this[arg.type](arg, window, event);
      event.returnValue = data;
      // event.sender.send(`msg-back-${arg.type}`, data);
    });
  }

  public getCurrentWindow = (window, e) => {
    let originWindow = BrowserWindow.fromWebContents(e.sender);
    if (originWindow !== window) originWindow = detachInstance.getWindow();
    return originWindow;
  };

  public __EscapeKeyDown = (event, input, window) => {
    if (input.type !== "keyDown") return;
    if (!(input.meta || input.control || input.shift || input.alt)) {
      if (input.key === "Escape") {
        if (this.currentPlugin) {
          this.removePlugin(null, window);
        } else {
          mainInstance.windowCreator.getWindow().hide();
        }
      }

      return;
    }
  };

  public loadPlugin({ data: plugin }, window) {
    window.webContents.executeJavaScript(
      `window.loadPlugin(${JSON.stringify(plugin)})`
    );
    this.openPlugin({ data: plugin }, window);
  }

  public openPlugin({ data: plugin }, window) {
    if (this.currentPlugin && this.currentPlugin.name === plugin.name) return;
    window.setSize(window.getSize()[0], 60);
    runnerInstance.removeView(window);
    runnerInstance.init(plugin, window);
    this.currentPlugin = plugin;
    window.webContents.executeJavaScript(
      `window.setCurrentPlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin
      })})`
    );
    window.show();
    // 按 ESC 退出插件
    window.webContents.on("before-input-event", (event, input) =>
      this.__EscapeKeyDown(event, input, window)
    );
    runnerInstance
      .getView()
      .webContents.on("before-input-event", (event, input) =>
        this.__EscapeKeyDown(event, input, window)
      );
  }

  public removePlugin(e, window) {
    this.currentPlugin = null;
    runnerInstance.removeView(window);
  }

  public openPluginDevTools() {
    runnerInstance.getView().webContents.openDevTools({ mode: "detach" });
  }

  public hideMainWindow(arg, window) {
    window.hide();
  }

  public showMainWindow(arg, window) {
    window.show();
  }

  public showOpenDialog({ data }, window) {
    dialog.showOpenDialogSync(window, data);
  }

  public setExpendHeight({ data: height }, window: BrowserWindow, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    const targetHeight = height;
    originWindow.setSize(originWindow.getSize()[0], targetHeight);
  }

  public setSubInput({ data }, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInput(${JSON.stringify({
        placeholder: data.placeholder
      })})`
    );
  }

  public subInputBlur() {
    runnerInstance.getView().webContents.focus();
  }

  public sendSubInputChangeEvent({ data }) {
    runnerInstance.executeHooks("SubInputChange", data);
  }

  public removeSubInput(data, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(`window.removeSubInput()`);
  }

  public setSubInputValue({ data }, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInputValue(${JSON.stringify({
        value: data.text
      })})`
    );
  }

  public getPath({ data }) {
    return app.getPath(data.name);
  }

  public showNotification({ data: { body } }) {
    if (!Notification.isSupported()) return;
    "string" != typeof body && (body = String(body));
    const plugin = this.currentPlugin;
    if (!plugin) return;
    const notify = new Notification({
      title: plugin.pluginName,
      body,
      icon: plugin.logo
    });
    notify.show();
  }

  public copyImage = ({ data }) => {
    const image = nativeImage.createFromDataURL(data.img);
    clipboard.writeImage(image);
  };

  public copyText({ data }) {
    clipboard.writeText(String(data.text));
    return true;
  }

  public copyFile({ data }) {
    if (data.file && fs.existsSync(data.file)) {
      clipboard.writeBuffer(
        "NSFilenamesPboardType",
        Buffer.from(plist.build([data.file]))
      );
      return true;
    }
    return false;
  }

  public dbPut({ data }) {
    return dbInstance.put(this.DBKEY, data.data);
  }

  public dbGet({ data }) {
    return dbInstance.get(this.DBKEY, data.id);
  }

  public dbRemove({ data }) {
    return dbInstance.remove(this.DBKEY, data.doc);
  }

  public dbBulkDocs({ data }) {
    return dbInstance.bulkDocs(this.DBKEY, data.docs);
  }

  public dbAllDocs({ data }) {
    return dbInstance.allDocs(this.DBKEY, data.key);
  }

  public getFeatures() {
    return this.currentPlugin.features;
  }

  public setFeature({ data }, window) {
    this.currentPlugin = {
      ...this.currentPlugin,
      features: (() => {
        let has = false;
        this.currentPlugin.features.some(feature => {
          has = feature.code === data.feature.code;
          return has;
        });
        if (!has) {
          return [...this.currentPlugin.features, data.feature];
        }
        return this.currentPlugin.features;
      })()
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin
      })})`
    );
    return true;
  }

  public removeFeature({ data }, window) {
    this.currentPlugin = {
      ...this.currentPlugin,
      features: this.currentPlugin.features.filter(feature => {
        if (data.code.type) {
          return feature.code.type !== data.code.type;
        }
        return feature.code !== data.code;
      })
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin
      })})`
    );
    return true;
  }

  public sendPluginSomeKeyDownEvent({ data: { modifiers, keyCode } }) {
    const code = DECODE_KEY[keyCode];
    if (!code || !runnerInstance.getView()) return;
    if (modifiers.length > 0) {
      runnerInstance.getView().webContents.sendInputEvent({
        type: "keyDown",
        modifiers,
        keyCode: code
      });
    } else {
      runnerInstance.getView().webContents.sendInputEvent({
        type: "keyDown",
        keyCode: code
      });
    }
  }

  public detachPlugin(e, window) {
    if (!this.currentPlugin) return;
    const view = window.getBrowserView();
    window.setBrowserView(null);
    window.webContents
      .executeJavaScript(`window.getMainInputInfo()`)
      .then(res => {
        detachInstance.init(
          {
            ...this.currentPlugin,
            subInput: res
          },
          window.getBounds(),
          view
        );
        window.webContents.executeJavaScript(`window.initRubick()`);
        window.setSize(window.getSize()[0], 60);
        this.currentPlugin = null;
      });
  }

  public detachInputChange({ data }) {
    this.sendSubInputChangeEvent({ data });
  }

  public getLocalId() {
    return encodeURIComponent(app.getPath("home"));
  }

  public shellShowItemInFolder({ data }) {
    shell.showItemInFolder(data.path);
    return true;
  }

  public shellBeep() {
    shell.beep();
    return true;
  }
}

export default new API();
