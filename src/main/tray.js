import { dialog, Menu, Tray, app, shell, ipcMain } from 'electron';
import path from 'path';
import pkg from '../../package.json';

function createTray(window) {
  return new Promise((resolve, reject) => {
    const appIcon = new Tray(path.join(__static, './rocket.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "帮助文档", click: () => {
          process.nextTick((() => {
            shell.openExternal('https://github.com/clouDr-f2e/rubick');
          }))
        }
      }, {
        label: "意见反馈", click: () => {
          process.nextTick((() => {
            shell.openExternal('https://github.com/clouDr-f2e/rubick/issues')
          }))
        }
      },
      {type: "separator"},
      {
        label: '显示窗口',
        accelerator: "Alt+R",
        click() {
          window.show();
        }
      },
      {
        role: 'quit',
        label: '退出'
      },
      {
        label: '重启',
        click() {
          app.relaunch();
          app.quit();
        }
      },
      {type: "separator"},
      {
        label: '偏好设置',
        click() {
          window.show();
          window.webContents.send('tray-setting');
        },
      },
      {
        label: '关于',
        click() {
          dialog.showMessageBox({
            title: '拉比克',
            message: '极简、插件化的现代桌面软件',
            detail: `Version: ${pkg.version}\nAuthor: muwoo`
          });
        },
      },
    ]);
    appIcon.on('click', () => {
      appIcon.popUpContextMenu(contextMenu);
    });
    appIcon.setContextMenu(contextMenu);

    resolve(appIcon);
  });
}

export default createTray;
