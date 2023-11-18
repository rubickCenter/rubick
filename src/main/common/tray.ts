import { dialog, Menu, Tray, app, shell, BrowserWindow } from 'electron';
import path from 'path';
import pkg from '../../../package.json';
import os from 'os';
import commonConst from '@/common/utils/commonConst';
import { guide } from '../browsers';

function createTray(window: BrowserWindow): Promise<Tray> {
  return new Promise((resolve) => {
    let icon;
    if (commonConst.macOS()) {
      icon = './icons/iconTemplate@2x.png';
    } else if (commonConst.windows()) {
      icon =
        parseInt(os.release()) < 10
          ? './icons/icon@2x.png'
          : './icons/icon.ico';
    } else {
      icon = './icons/icon@2x.png';
    }
    const appIcon = new Tray(path.join(__static, icon));

    const openSettings = () => {
      window.webContents.executeJavaScript(
        `window.rubick && window.rubick.openMenu && window.rubick.openMenu({ code: "settings" })`
      );
      window.show();
    };

    const createContextMenu = () =>
      Menu.buildFromTemplate([
        {
          label: '帮助文档',
          click: () => {
            process.nextTick(() => {
              shell.openExternal('https://github.com/clouDr-f2e/rubick');
            });
          },
        },
        {
          label: '引导教学',
          click: () => {
            guide().init();
          },
        },
        {
          label: '意见反馈',
          click: () => {
            process.nextTick(() => {
              shell.openExternal('https://github.com/clouDr-f2e/rubick/issues');
            });
          },
        },
        { type: 'separator' },
        {
          label: '显示',
          click() {
            window.show();
          },
        },
        {
          label: '系统设置',
          click() {
            openSettings();
          },
        },
        { type: 'separator' },
        {
          role: 'quit',
          label: '退出',
        },
        {
          label: '重启',
          click() {
            app.relaunch();
            app.quit();
          },
        },

        { type: 'separator' },
        {
          label: '关于',
          click() {
            dialog.showMessageBox({
              title: '拉比克',
              message: '极简、插件化的现代桌面软件',
              detail: `Version: ${pkg.version}\nAuthor: muwoo`,
            });
          },
        },
      ]);
    appIcon.on('click', () => {
      appIcon.setContextMenu(createContextMenu());
      appIcon.popUpContextMenu();
    });
    appIcon.setContextMenu(createContextMenu());

    resolve(appIcon);
  });
}

export default createTray;
