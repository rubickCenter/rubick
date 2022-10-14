import {
  BrowserWindow,
  ipcMain,
  dialog,
  app,
  Notification,
  nativeImage,
  clipboard,
  shell,
} from "electron";
import { runner, detach } from "../browsers";
import fs from "fs";
import { LocalDb } from "@/core";
import plist from "plist";
import { DECODE_KEY } from "@/common/constans/main";

const runnerInstance = runner();
const detachInstance = detach();
const dbInstance = new LocalDb(app.getPath("userData"));

dbInstance.init();

class API {
  static currentPlugin: null | any = null;
  static DBKEY = "RUBICK_DB_DEFAULT";

  static getCurrentWindow = (window, e) => {
    let originWindow = BrowserWindow.fromWebContents(e.sender);
    if (originWindow !== window) originWindow = detachInstance.getWindow();
    return originWindow;
  };

  static __EscapeKeyDown = (event, input, window) => {
    if (input.type !== "keyDown") return;
    if (!(input.meta || input.control || input.shift || input.alt)) {
      if (input.key === "Escape") {
        API.removePlugin(null, window);
      }
      return;
    }
  };

  static loadPlugin({ data: plugin }, window) {
    window.webContents.executeJavaScript(
      `window.loadPlugin(${JSON.stringify(plugin)})`
    );
    API.openPlugin({ data: plugin }, window);
  }

  static openPlugin({ data: plugin }, window) {
    if (API.currentPlugin && API.currentPlugin.name === plugin.name) return;
    window.setSize(window.getSize()[0], 60);
    runnerInstance.removeView(window);
    runnerInstance.init(plugin, window);
    API.currentPlugin = plugin;
    window.webContents.executeJavaScript(
      `window.setCurrentPlugin(${JSON.stringify({
        currentPlugin: API.currentPlugin,
      })})`
    );
    window.show();
    // 按 ESC 退出插件
    window.webContents.on("before-input-event", (event, input) =>
      API.__EscapeKeyDown(event, input, window)
    );
    runnerInstance
      .getView()
      .webContents.on("before-input-event", (event, input) =>
        API.__EscapeKeyDown(event, input, window)
      );
  }

  static removePlugin(e, window) {
    API.currentPlugin = null;
    runnerInstance.removeView(window);
  }

  static openPluginDevTools() {
    runnerInstance.getView().webContents.openDevTools({ mode: "detach" });
  }

  static hideMainWindow(arg, window) {
    window.hide();
  }

  static showMainWindow(arg, window) {
    window.show();
  }

  static showOpenDialog({ data }, window) {
    dialog.showOpenDialogSync(window, data);
  }

  static setExpendHeight({ data: height }, window: BrowserWindow, e) {
    const originWindow = API.getCurrentWindow(window, e);
    if (!originWindow) return;
    const targetHeight = height;
    originWindow.setSize(originWindow.getSize()[0], targetHeight);
  }

  static setSubInput({ data }, window, e) {
    const originWindow = API.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInput(${JSON.stringify({
        placeholder: data.placeholder,
      })})`
    );
  }

  static subInputBlur() {
    runnerInstance.getView().webContents.focus();
  }

  static sendSubInputChangeEvent({ data }) {
    runnerInstance.executeHooks("SubInputChange", data);
  }

  static removeSubInput(data, window, e) {
    const originWindow = API.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(`window.removeSubInput()`);
  }

  static setSubInputValue({ data }, window, e) {
    const originWindow = API.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInputValue(${JSON.stringify({
        value: data.text,
      })})`
    );
  }

  static getPath({ data }) {
    return app.getPath(data.name);
  }

  static showNotification({ data: { body } }) {
    if (!Notification.isSupported()) return;
    "string" != typeof body && (body = String(body));
    const plugin = API.currentPlugin;
    if (!plugin) return;
    const notify = new Notification({
      title: plugin.pluginName,
      body,
      icon: plugin.logo,
    });
    notify.show();
  }

  static copyImage = ({ data }) => {
    const image = nativeImage.createFromDataURL(data.img);
    clipboard.writeImage(image);
  };

  static copyText({ data }) {
    clipboard.writeText(String(data.text));
    return true;
  }

  static copyFile({ data }) {
    if (data.file && fs.existsSync(data.file)) {
      clipboard.writeBuffer(
        "NSFilenamesPboardType",
        Buffer.from(plist.build([data.file]))
      );
      return true;
    }
    return false;
  }

  static dbPut({ data }) {
    return dbInstance.put(API.DBKEY, data.data);
  }

  static dbGet({ data }) {
    return dbInstance.get(API.DBKEY, data.id);
  }

  static dbRemove({ data }) {
    return dbInstance.remove(API.DBKEY, data.doc);
  }

  static dbBulkDocs({ data }) {
    return dbInstance.bulkDocs(API.DBKEY, data.docs);
  }

  static dbAllDocs({ data }) {
    return dbInstance.allDocs(API.DBKEY, data.key);
  }

  static getFeatures() {
    return API.currentPlugin.features;
  }

  static setFeature({ data }, window) {
    API.currentPlugin = {
      ...API.currentPlugin,
      features: (() => {
        let has = false;
        API.currentPlugin.features.some((feature) => {
          has = feature.code === data.feature.code;
          return has;
        });
        if (!has) {
          return [...API.currentPlugin.features, data.feature];
        }
        return API.currentPlugin.features;
      })(),
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: API.currentPlugin,
      })})`
    );
    return true;
  }

  static removeFeature({ data }, window) {
    API.currentPlugin = {
      ...API.currentPlugin,
      features: API.currentPlugin.features.filter((feature) => {
        if (data.code.type) {
          return feature.code.type !== data.code.type;
        }
        return feature.code !== data.code;
      }),
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: API.currentPlugin,
      })})`
    );
    return true;
  }

  static sendPluginSomeKeyDownEvent({ data: { modifiers, keyCode } }) {
    const code = DECODE_KEY[keyCode];
    if (!code || !runnerInstance.getView()) return;
    if (modifiers.length > 0) {
      runnerInstance.getView().webContents.sendInputEvent({
        type: "keyDown",
        modifiers,
        keyCode: code,
      });
    } else {
      runnerInstance.getView().webContents.sendInputEvent({
        type: "keyDown",
        keyCode: code,
      });
    }
  }

  static detachPlugin(e, window) {
    if (!API.currentPlugin) return;
    const view = window.getBrowserView();
    window.setBrowserView(null);
    window.webContents
      .executeJavaScript(`window.getMainInputInfo()`)
      .then((res) => {
        detachInstance.init(
          {
            ...API.currentPlugin,
            subInput: res,
          },
          window.getBounds(),
          view
        );
        window.webContents.executeJavaScript(`window.initRubick()`);
        window.setSize(window.getSize()[0], 60);
        API.currentPlugin = null;
      });
  }

  static detachInputChange({ data }) {
    API.sendSubInputChangeEvent({ data });
  }

  static getLocalId() {
    return encodeURIComponent(app.getPath("home"));
  }

  static shellShowItemInFolder({ data }) {
    shell.showItemInFolder(data.path);
    return true;
  }

  static shellBeep() {
    shell.beep();
    return true;
  }
}

export default (mainWindow: BrowserWindow) => {
  // 响应 preload.js 事件
  ipcMain.on("msg-trigger", async (event, arg) => {
    const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
    const data = await API[arg.type](arg, window, event);
    event.returnValue = data;
    // event.sender.send(`msg-back-${arg.type}`, data);
  });
};
