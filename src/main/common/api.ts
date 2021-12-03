import { BrowserWindow, ipcMain } from "electron";
import { runner } from "../browsers";

const runnerInstance = runner();

const API: any = {
  setExpendHeight({ height }: { height: number }, win: BrowserWindow): void {
    win.setSize(800, height || 60);
  },
  openPlugin({ plugin }, window) {
    runnerInstance.removeView(window);
    runnerInstance.init(plugin, window);
  },
  removePlugin(e, window) {
    runnerInstance.removeView(window);
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
