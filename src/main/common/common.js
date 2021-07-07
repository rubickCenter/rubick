import {
  globalShortcut,
  ipcMain,
  BrowserWindow,
  clipboard,
  Notification,
  app,
} from 'electron';
import Api from './api';
import robot from 'robotjs';
import './config';
import ioHook from 'iohook';

const browsers = require("../browsers")();
const {picker, separator, superPanel, capture} = browsers;
// 需要在超级面板展示的插件
let optionPlugin = [];

let closePicker = () => {
  if (picker.getWindow()) {
    ipcMain.removeListener("closePicker", closePicker);
    picker.getWindow().close();
  }
};

function registerShortCut(mainWindow) {
  const config = global.opConfig.get();
  globalShortcut.unregisterAll();
  // 注册偏好快捷键
  globalShortcut.register(config.perf.shortCut.showAndHidden, () => {
    mainWindow.show();
  });

  globalShortcut.register(config.perf.shortCut.separate, () => {
    mainWindow.webContents.send('new-window');
  });

  // 注册自定义全局快捷键
  config.global.forEach(sc => {
    if (!sc.key || !sc.value) return;
    globalShortcut.register(sc.key, () => {
      mainWindow.webContents.send('global-short-key', sc.value);
    });
  });

  globalShortcut.register('Esc', () => {
    capture.close();
  });
}

const getSelectedText = () => {
  return new Promise((resolve) => {
    const lastText = clipboard.readText('clipboard');

    const platform = process.platform;
    if (platform === 'darwin') {
      robot.keyTap('c', 'command');
    } else {
      robot.keyTap('c', 'control');
    }

    setTimeout(() => {
      const text = clipboard.readText('clipboard') || ''
      const fileUrl = clipboard.read('public.file-url');
      clipboard.writeText(lastText);

      resolve({
        text,
        fileUrl
      })
    }, 300);
  })
}

export default function init(mainWindow) {
  ipcMain.on('optionPlugin', (e, args) => {
    optionPlugin = args;
  });
  ipcMain.on('right-down', async (e) => {
    const copyResult = await getSelectedText();
    let win = superPanel.getWindow();

    if (win) {
      win.webContents.send('trigger-super-panel', {
        ...copyResult,
        optionPlugin: optionPlugin.plugins,
      });
    } else {
      superPanel.init(mainWindow);
      win = superPanel.getWindow();

      win.once('ready-to-show', () => {
        win.webContents.send('trigger-super-panel', {
          ...copyResult,
          optionPlugin: optionPlugin.plugins,
        });
      });
    }
    const pos = robot.getMousePos();
    win.setPosition(parseInt(pos.x), parseInt(pos.y));
    win.show();
  });

  // 注册快捷键
  registerShortCut(mainWindow);

  // 设置开机启动
  const config = global.opConfig.get();
  app.setLoginItemSettings({
    openAtLogin: config.perf.common.start,
    openAsHidden: true,
  });

  mainWindow.once("ready-to-show", () => {
    // 非隐藏式启动需要显示主窗口
    if (!app.getLoginItemSettings().wasOpenedAsHidden) {
      mainWindow.show();
    }
  });

  ipcMain.on('re-register', (event, arg) => {
    registerShortCut(mainWindow);
  });

  ipcMain.on('changeWindowSize-rubick', (event, arg) => {
    mainWindow.setSize(arg.width || 800, arg.height);
  });

  // 打包后，失焦隐藏
  mainWindow.on('blur', () => {
    app.isPackaged && mainWindow.hide();
  });

  // 响应 preload.js 事件
  ipcMain.on('msg-trigger', async (event, arg) => {
    const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow
    const operators = arg.type.split('.');
    let fn = Api;
    operators.forEach((op) => {
      fn = fn[op];
    });
    const data = await fn(arg, window);
    event.sender.send(`msg-back-${arg.type}`, data);
  });

  // 窗口分离
  ipcMain.on('new-window', (event, arg) => {
    const opts = {
      ...arg,
      searchType: 'subWindow',
    }
    separator.init(opts);
  });

  // 拾色器
  ipcMain.on('start-picker', () => {
    // 开启输入侦测
    ioHook.start(false)
    picker.init();

    picker.getWindow().on('close', () => {
      ioHook.stop();
    });


    ioHook.on('mousemove', e => {
      let x = e.x
      let y = e.y
      if (!picker.getWindow()) return;
      let color = "#" + robot.getPixelColor(parseInt(x), parseInt(y));
      picker.getWindow().setPosition(parseInt(x) - 50, parseInt(y) - 50);
      picker.getWindow().webContents.send("updatePicker", color);
    })

    ioHook.on('mouseup', e => {
      if (e.button === 1) {
        let x = e.x
        let y = e.y
        const color = "#" + robot.getPixelColor(parseInt(x), parseInt(y));
        clipboard.writeText("#" + robot.getPixelColor(parseInt(x), parseInt(y)));
        new Notification({ title: 'Rubick 通知', body: `${color} 已保存到剪切板` }).show();
        closePicker();
      }
    });

    let pos = robot.getMousePos();
    picker
      .getWindow()
      .setPosition(parseInt(pos.x) - 50, parseInt(pos.y) - 50);

    picker
      .getWindow()
      .webContents.send(
      "updatePicker",
      robot.getPixelColor(pos.x, pos.y)
    );

    ipcMain.on("closePicker", closePicker);
    ioHook.on('mouseup', e => {
      if (e.button === 3) {
        closePicker()
      }
    });
  })
}


