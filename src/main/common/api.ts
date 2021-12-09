import {
  BrowserWindow,
  ipcMain,
  dialog,
  app,
  Notification,
  nativeImage,
  clipboard,
} from "electron";
import { runner } from "../browsers";
import path from "path";
import fs from "fs";
import { LocalDb } from "@/core";
import plist from "plist";

const runnerInstance = runner();
const dbInstance = new LocalDb(app.getPath("userData"));

dbInstance.init();

const API: any = {
  currentPlugin: null,
  DBKEY: "RUBICK_DB_DEFAULT",
  openPlugin({ plugin }, window) {
    if (API.currentPlugin && API.currentPlugin.name === plugin.name) return;
    runnerInstance.removeView(window);
    runnerInstance.init(plugin, window);
    API.currentPlugin = plugin;
  },
  removePlugin(e, window) {
    API.currentPlugin = null;
    runnerInstance.removeView(window);
  },
  hideMainWindow(arg, window) {
    window.hide();
  },
  showMainWindow(arg, window) {
    window.show();
  },
  showOpenDialog({ data }, window) {
    dialog.showOpenDialogSync(window, data);
  },
  setExpendHeight({ data: height }, window: BrowserWindow) {
    const targetHeight = height;
    window.setSize(window.getSize()[0], targetHeight);
  },
  setSubInput({ data }, window) {
    window.webContents.executeJavaScript(
      `window.setSubInput(${JSON.stringify({
        placeholder: data.placeholder,
      })})`
    );
  },
  sendSubInputChangeEvent({ data }) {
    runnerInstance.executeHooks("SubInputChange", data);
  },
  removeSubInput(e, window) {
    window.webContents.executeJavaScript(`window.removeSubInput()`);
  },
  setSubInputValue({ data }, window) {
    window.webContents.executeJavaScript(
      `window.setSubInputValue(${JSON.stringify({
        value: data.text,
      })})`
    );
  },
  getPath({ data }) {
    return app.getPath(data.name);
  },
  showNotification({ data: { body } }) {
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
  },
  copyImage: ({ data }) => {
    const image = nativeImage.createFromDataURL(data.img);
    clipboard.writeImage(image);
  },
  copyText({ data }) {
    clipboard.writeText(String(data.text));
    return true;
  },
  copyFile: ({ data }) => {
    if (data.file && fs.existsSync(data.file)) {
      clipboard.writeBuffer(
        "NSFilenamesPboardType",
        Buffer.from(plist.build([data.file]))
      );
      return true;
    }
    return false;
  },
  dbPut({ data }) {
    return dbInstance.put(API.DBKEY, data.data);
  },
  dbGet({ data }) {
    return dbInstance.get(API.DBKEY, data.id);
  },
  dbRemove({ data }) {
    return dbInstance.remove(API.DBKEY, data.doc);
  },
  dbBulkDocs({ data }) {
    return dbInstance.bulkDocs(API.DBKEY, data.docs);
  },
  dbAllDocs({ data }) {
    return dbInstance.bulkDocs(API.DBKEY, data.key);
  },
  getFeatures() {
    return API.currentPlugin.features;
  },
  setFeature({ data }, window) {
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
  },
  removeFeature({ data }, window) {
    API.currentPlugin = {
      ...API.currentPlugin,
      features: API.currentPlugin.features.filter(
        (feature) => feature.code !== data.code
      ),
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: API.currentPlugin,
      })})`
    );
    return true;
  },
};

export default (mainWindow: BrowserWindow) => {
  // 响应 preload.js 事件
  ipcMain.on("msg-trigger", async (event, arg) => {
    const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;

    const data = await API[arg.type](arg, window, event);
    event.returnValue = data;
    // event.sender.send(`msg-back-${arg.type}`, data);
  });
};
