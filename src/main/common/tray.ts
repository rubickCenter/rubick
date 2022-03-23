import { dialog, Menu, Tray, app, shell, BrowserWindow } from "electron";
import path from "path";
import pkg from "../../../package.json";
import os from "os";
import commonConst from "@/common/utils/commonConst";

function createTray(window: BrowserWindow): Promise<Tray> {
  return new Promise((resolve) => {
    let icon;
    if (commonConst.macOS()) {
      icon = "./icons/icon@3x.png";
    } else if (commonConst.windows()) {
      icon =
        parseInt(os.release()) < 10
          ? "./icons/icon@2x.png"
          : "./icons/icon.ico";
    } else {
      icon = "./icons/icon@2x.png";
    }
    const appIcon = new Tray(path.join(__static, icon));

    const getShowAndHiddenHotKey = (): string => {
      const config = global.OP_CONFIG.get();
      return config.perf.shortCut.showAndHidden;
    }

    const createContextMenu = () => Menu.buildFromTemplate([
      {
        label: "帮助文档",
        click: () => {
          process.nextTick(() => {
            shell.openExternal("https://github.com/clouDr-f2e/rubick");
          });
        },
      },
      {
        label: "意见反馈",
        click: () => {
          process.nextTick(() => {
            shell.openExternal("https://github.com/clouDr-f2e/rubick/issues");
          });
        },
      },
      { type: "separator" },
      {
        label: "显示窗口",
        accelerator: getShowAndHiddenHotKey(),
        click() {
          window.show();
        },
      },
      {
        role: "quit",
        label: "退出",
      },
      {
        label: "重启",
        click() {
          app.relaunch();
          app.quit();
        },
      },
      { type: "separator" },
      {
        label: "关于",
        click() {
          dialog.showMessageBox({
            title: "拉比克",
            message: "极简、插件化的现代桌面软件",
            detail: `Version: ${pkg.version}\nAuthor: muwoo`,
          });
        },
      },
    ]);
    appIcon.on("click", () => {
      appIcon.setContextMenu(createContextMenu());
      appIcon.popUpContextMenu();
    });
    appIcon.setContextMenu(createContextMenu());

    resolve(appIcon);
  });
}

export default createTray;
