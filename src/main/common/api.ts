import { BrowserWindow, ipcMain, dialog, webContents } from "electron";
import { runner } from "../browsers";

const runnerInstance = runner();

function getWorkWebContentsBySender(sender, mainWindow) {
  const window = BrowserWindow.fromWebContents(sender);
  console.log(window);

  if (!window) return null;
  return window.webContents;
}

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
