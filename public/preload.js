const { ipcRenderer, shell } = require("electron");
const os = require("os");

const ipcSendSync = (type, data) => {
  const returnValue = ipcRenderer.sendSync("msg-trigger", {
    type,
    data
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
};

const ipcSend = (type, data) => {
  ipcRenderer.send("msg-trigger", {
    type,
    data
  });
};

window.rubick = {
  hooks: {},
  // 事件
  onPluginEnter(cb) {
    console.log(window.rubick.hooks);
    typeof cb === "function" && (window.rubick.hooks.onPluginEnter = cb);
  },
  onPluginReady(cb) {
    typeof cb === "function" && (window.rubick.hooks.onPluginReady = cb);
  },
  onPluginOut(cb) {
    typeof cb === "function" && (window.rubick.hooks.onPluginOut = cb);
  },
  openPlugin(plugin) {
    ipcSendSync("loadPlugin", plugin);
  },
  // 窗口交互
  hideMainWindow() {
    ipcSendSync("hideMainWindow");
  },
  showMainWindow() {
    ipcSendSync("showMainWindow");
  },
  showOpenDialog(options) {
    ipcSendSync("showOpenDialog", options);
  },
  setExpendHeight(height) {
    ipcSendSync("setExpendHeight", height);
  },
  setSubInput(onChange, placeholder = "", isFocus) {
    typeof onChange === "function" &&
      (window.rubick.hooks.onSubInputChange = onChange);
    ipcSendSync("setSubInput", {
      placeholder,
      isFocus
    });
  },
  removeSubInput() {
    delete window.rubick.hooks.onSubInputChange;
    ipcSendSync("removeSubInput");
  },
  setSubInputValue(text) {
    ipcSendSync("setSubInputValue", { text });
  },
  subInputBlur() {
    ipcSendSync("subInputBlur");
  },
  getPath(name) {
    return ipcSendSync("getPath", { name });
  },
  showNotification(body, clickFeatureCode) {
    ipcSend("showNotification", { body, clickFeatureCode });
  },
  copyImage(img) {
    return ipcSendSync("copyImage", { img });
  },
  copyText(text) {
    return ipcSendSync("copyText", { text });
  },
  copyFile: file => {
    return ipcSendSync("copyFile", { file });
  },
  db: {
    put: data => ipcSendSync("dbPut", { data }),
    get: id => ipcSendSync("dbGet", { id }),
    remove: doc => ipcSendSync("dbRemove", { doc }),
    bulkDocs: docs => ipcSendSync("dbBulkDocs", { docs }),
    allDocs: key => ipcSendSync("dbAllDocs", { key })
  },
  dbStorage: {
    setItem: (key, value) => {
      const target = { _id: String(key) };
      const result = ipcSendSync("dbGet", { id: target._id });
      result && (target._rev = result._rev);
      target.value = value;
      const res = ipcSendSync("dbPut", { data: target });
      if (res.error) throw new Error(res.message);
    },
    getItem: key => {
      const res = ipcSendSync("dbGet", { id: key });
      return res && "value" in res ? res.value : null;
    },
    removeItem: key => {
      const res = ipcSendSync("dbGet", { id: key });
      res && ipcSendSync("dbRemove", { doc: res });
    }
  },
  isDarkColors() {
    return false;
  },
  getFeatures() {
    return ipcSendSync("getFeatures");
  },
  setFeature(feature) {
    return ipcSendSync("setFeature", { feature });
  },
  removeFeature(code) {
    return ipcSendSync("removeFeature", { code });
  },

  // 系统
  shellOpenExternal(url) {
    shell.openExternal(url);
  },

  isMacOs() {
    return os.type() === "Darwin";
  },

  isWindows() {
    return os.type() === "Windows_NT";
  },

  isLinux() {
    return os.type() === "Linux";
  },

  shellOpenPath(path) {
    shell.openPath(path);
  },

  getLocalId: () => ipcSendSync("getLocalId"),

  removePlugin() {
    ipcSend("removePlugin");
  },

  shellShowItemInFolder: path => {
    ipcSend("shellShowItemInFolder", { path });
  },

  redirect: (label, payload) => {
    // todo
  },

  shellBeep: () => {
    ipcSend("shellBeep")
  },
};
