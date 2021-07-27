import {BrowserWindow, clipboard, globalShortcut, ipcMain, Notification, screen} from "electron";
import {exec, spawn} from "child_process";
import robot from "robotjs";
import Api from "./api";
import ioHook from 'iohook';
import {throttle} from './utils';

const browsers = require("../browsers")();
const {picker, separator, superPanel} = browsers;

class Listener {
  constructor() {
    this.optionPlugin = {};
  }

  getSelectedContent() {
    return new Promise((resolve) => {
      const lastText = clipboard.readText('clipboard');
      // todo 缓存文件
      clipboard.clear();

      // 复制选中文案
      const platform = process.platform;
      if (platform === 'darwin') {
        robot.keyTap('c', 'command');
      } else {
        robot.keyTap('c', 'control');
      }

      setTimeout(() => {
        // 延时一定时间才能从剪切板内读取到内容
        const text = clipboard.readText('clipboard') || ''
        const fileUrl = clipboard.read('public.file-url');

        // 如果之前是文案，则回填
        clipboard.writeText(lastText);

        resolve({
          text,
          fileUrl
        })
      }, 300);
    })
  }

  registerShortCut(mainWindow) {
    const config = global.opConfig.get();
    globalShortcut.unregisterAll();
    // 注册偏好快捷键
    globalShortcut.register(config.perf.shortCut.showAndHidden, () => {
      const {x, y} = screen.getCursorScreenPoint();
      const currentDisplay = screen.getDisplayNearestPoint({ x, y });
      const wx = parseInt(currentDisplay.workArea.x + currentDisplay.workArea.width / 2 - 400);
      const wy = parseInt(currentDisplay.workArea.y + currentDisplay.workArea.height / 2 - 200);
      mainWindow.setVisibleOnAllWorkspaces(true);
      mainWindow.focus();
      mainWindow.setVisibleOnAllWorkspaces(false);
      mainWindow.setPosition(wx, wy);
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
  }

  init(mainWindow) {
    this.fn = throttle(({x, y}, picker) => {
      const img = robot.screen.capture(parseInt(x) - 5, parseInt(y) - 5, 9, 9);

      const colors = {}

      for(let i = 0; i< 9; i++) {
        colors[i] = {};
        for (let j = 0; j < 9; j++) {
          colors[i][j] = img.colorAt(j, i);
        }
      }
      picker.getWindow().webContents.send("updatePicker", colors);
    }, 100);

    this.colorPicker();
    this.initPlugin();
    this.lockScreen();
    this.separate();
    this.initCapture();
    this.superPanel(mainWindow);
    this.reRegisterShortCut(mainWindow);
    this.changeSize(mainWindow);
    this.msgTrigger(mainWindow);
  }

  colorPicker() {
    // 拾色器
    ipcMain.on('start-picker', () => {
      // 开启输入侦测
      ioHook.start(false);
      ioHook.load();
      picker.init();

      picker.getWindow().on('close', () => {
        ioHook.stop();
        ioHook.unload();
      });

      let pos = robot.getMousePos();
      picker
        .getWindow()
        .setPosition(parseInt(pos.x) + 10, parseInt(pos.y) + 10);

      const img = robot.screen.capture(parseInt(pos.x) - 5, parseInt(pos.y) - 5, 9, 9);

      const colors = {}

      for(let i = 0; i< 9; i++) {
        colors[i] = {};
        for (let j = 0; j < 9; j++) {
          colors[i][j] = img.colorAt(j, i);
        }
      }

      picker
        .getWindow()
        .webContents.send(
        "updatePicker",
        colors
      );

      ipcMain.on("closePicker", () => {
        this.closePicker();
      });
    });
    ioHook.on('mousemove', e => {
      let x = e.x
      let y = e.y
      if (!picker.getWindow()) return;
      picker.getWindow().setPosition(parseInt(x) + 10, parseInt(y) + 10);
      this.fn(e, picker);
    })

    ioHook.on('mouseup', e => {
      if (e.button === 1) {
        let x = e.x
        let y = e.y
        const color = "#" + robot.getPixelColor(parseInt(x), parseInt(y));
        clipboard.writeText("#" + robot.getPixelColor(parseInt(x), parseInt(y)));
        new Notification({ title: 'Rubick 通知', body: `${color} 已保存到剪切板` }).show();
        this.closePicker();
      }
    });

    ioHook.on('mouseup', e => {
      if (e.button === 3) {
        this.closePicker()
      }
    });
  }

  closePicker() {
    if (picker.getWindow()) {
      ipcMain.removeListener("closePicker", this.closePicker);
      picker.getWindow().close();
    }
  }

  initPlugin() {
    ipcMain.on('optionPlugin', (e, args) => {
      this.optionPlugin = args;
    });
  }

  lockScreen() {
    // 锁屏
    ipcMain.on('lock-screen', () => {
      const lockCommands = {
        darwin: '/System/Library/CoreServices/ScreenSaverEngine.app/Contents/MacOS/ScreenSaverEngine',
        win32: 'rundll32.exe user32.dll, LockWorkStation',
        linux: '(hash gnome-screensaver-command 2>/dev/null && gnome-screensaver-command -l) || (hash dm-tool 2>/dev/null && dm-tool lock)'
      };
      exec(lockCommands[process.platform]);
    });
  }

  superPanel(mainWindow) {
    // 长按右击呼起超级面板
    ipcMain.on('right-down', async () => {
      const copyResult = await this.getSelectedContent();
      let win = superPanel.getWindow();

      if (win) {
        win.webContents.send('trigger-super-panel', {
          ...copyResult,
          optionPlugin: this.optionPlugin.plugins,
        });
      } else {
        superPanel.init(mainWindow);
        win = superPanel.getWindow();

        win.once('ready-to-show', () => {
          win.webContents.send('trigger-super-panel', {
            ...copyResult,
            optionPlugin: this.optionPlugin.plugins,
          });
        });
      }
      const pos = robot.getMousePos();
      win.setPosition(parseInt(pos.x), parseInt(pos.y));
      win.show();
    });
  }

  reRegisterShortCut(mainWindow) {
    ipcMain.on('re-register', (event, arg) => {
      this.registerShortCut(mainWindow);
    });
  }

  changeSize(mainWindow) {
    // 修改窗口尺寸
    ipcMain.on('changeWindowSize-rubick', (event, arg) => {
      mainWindow.setSize(arg.width || 800, arg.height);
    });
  }

  msgTrigger(mainWindow) {
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
  }

  separate() {
    // 窗口分离
    ipcMain.on('new-window', (event, arg) => {
      const opts = {
        ...arg,
        searchType: 'subWindow',
      }
      separator.init(JSON.stringify(opts));
    });
  }

  initCapture() {
    ipcMain.on('capture-screen', () => {
      spawn('/usr/sbin/screencapture', ["-c", "-i", "-r"], {detached: !0});
    });
  }
}

export default Listener;
