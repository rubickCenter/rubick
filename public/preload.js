const {ipcRenderer} = require("electron");

const ipcSendSync = (type, data) => {
  const returnValue = ipcRenderer.sendSync("msg-trigger", {
    type,
    data,
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
};

window.rubick = {
  hooks: {},
  // 事件
  onPluginEnter(cb) {
    console.log(window.rubick.hooks)
    typeof cb === "function" && (window.rubick.hooks.onPluginEnter = cb);
  },
  onPluginReady(cb) {
    typeof cb === "function" && (window.rubick.hooks.onPluginReady = cb);
  },
  onPluginOut(cb) {
    typeof cb === "function" && (window.rubick.hooks.onPluginOut = cb);
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
      isFocus,
    });
  },
};
