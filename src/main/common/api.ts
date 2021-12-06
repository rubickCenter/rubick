import { BrowserWindow, ipcMain, dialog } from "electron";
import { runner } from "../browsers";

const runnerInstance = runner();

const API: any = {
  openPlugin({ plugin }, window) {
    runnerInstance.removeView(window);
    runnerInstance.init(plugin, window);
  },
  removePlugin(e, window) {
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
  setSubInput() {

  },
};

export default (mainWindow: BrowserWindow) => {
  // 响应 preload.js 事件
  ipcMain.on("msg-trigger", async (event, arg) => {
    const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;

    const data = await API[arg.type](arg, window);
    event.returnValue = data;
    // event.sender.send(`msg-back-${arg.type}`, data);
  });
};
