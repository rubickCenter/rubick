import { dialog, Menu, Tray, app, shell, ipcMain } from 'electron';
import path from 'path';
import pkg from '../../package.json';

function createTray(window) {
  return new Promise((resolve, reject) => {
    const appIcon = new Tray(path.join(__static, './rocket.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        id: 3,
        label: '显示窗口',
        accelerator: "Alt+R",
        click() {
          window.show();
        }
      },
      {
        id: 4,
        label: '文档',
        click() {
          shell.openExternal('https://muwoo.github.io/rubick-doc/');
        }
      },

      {
        id: 5,
        label: '显示窗口',
        click() {
          window.show();
        }
      },

      {
        id: 6,
        label: '关于',
        click() {
          dialog.showMessageBox({
            title: '拉比克',
            message: '一站式前端开发工具箱',
            detail: `Version: ${pkg.version}\nAuthor: muwoo`
          });
        }
      },
      {
        id: 7,
        role: 'quit',
        label: '退出'
      }
    ]);
    appIcon.on('click', () => {
      appIcon.popUpContextMenu(contextMenu);
    });
    appIcon.setContextMenu(contextMenu);

    resolve(appIcon);
  });
}

export default createTray;
