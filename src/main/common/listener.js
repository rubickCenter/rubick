import {
  app,
  nativeImage,
  BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
  Notification,
  screen,
  TouchBar
} from 'electron';
import {exec, spawn} from "child_process";
import robot from "robotjs";
import Api from "./api";
import ioHook from 'iohook';
import {throttle, commonConst} from './utils';
import path from 'path';
import fs from "fs";
import mito from './monitor';

const browsers = require("../browsers")();
const {picker, separator, superPanel} = browsers;

class Listener {
  constructor() {
    this.optionPlugin = {};
    this.isWin = process.platform === 'win32';
  }

  getSelectedContent() {
    return new Promise((resolve) => {
      const lastText = clipboard.readText('clipboard');
      // todo 缓存文件
      clipboard.clear();

      // 复制选中文案
      if (commonConst.macOS()) {
        robot.keyTap('c', 'command');
      } else {
        robot.keyTap('c', 'control');
      }

      setTimeout(() => {
        // 延时一定时间才能从剪切板内读取到内容
        const text = clipboard.readText('clipboard') || ''
        const fileUrl = clipboard.read('public.file-url');
        if (this.isWin) {
          // todo https://github.com/njzydark/Aragorn/blob/afe4a60972b4255dd417480ca6aca2af1fd8e637/packages/aragorn-app-main/src/uploaderManager.ts#L88
        }
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
      const currentDisplay = screen.getDisplayNearestPoint({x, y});
      const wx = parseInt(currentDisplay.workArea.x + currentDisplay.workArea.width / 2 - 400);
      const wy = parseInt(currentDisplay.workArea.y + currentDisplay.workArea.height / 2 - 200);

      mainWindow.setAlwaysOnTop(true)
      mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
      mainWindow.focus();
      mainWindow.setVisibleOnAllWorkspaces(false, {visibleOnFullScreen: true});
      mainWindow.setPosition(wx, wy);
      mainWindow.show();
    });

    globalShortcut.register(config.perf.shortCut.separate, () => {
      mainWindow.webContents.send('new-window');
    });

    globalShortcut.register(config.perf.shortCut.quit, () => {
      mainWindow.webContents.send('init-rubick');
      mainWindow.show();
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
      const {scaleFactor} = screen.getDisplayNearestPoint({x, y});
      const img = robot.screen.capture(
        x - parseInt(5 / scaleFactor),
        y - parseInt(5 / scaleFactor),
        10,
        10
      );

      const colors = {}

      for (let i = 0; i < 9; i++) {
        colors[i] = {};
        for (let j = 0; j < 9; j++) {
          colors[i][j] = img.colorAt(j, i);
        }
      }
      picker.getWindow().webContents.send("updatePicker", colors);
    }, 100);

    this.setAutoLogin();
    this.colorPicker();
    this.initPlugin();
    this.lockScreen();
    this.separate();
    this.initCapture();
    this.initTouchBar(mainWindow);
    this.superPanel(mainWindow);
    this.reRegisterShortCut(mainWindow);
    this.changeSize(mainWindow);
    this.msgTrigger(mainWindow);
    this.windowMoveInit(mainWindow);
  }

  colorPicker() {
    // 拾色器
    ipcMain.on('start-picker', () => {
      // 开启输入侦测
      ioHook.start(false);
      !this.isWin && ioHook.load();
      picker.init();

      picker.getWindow().on('close', () => {
        ioHook.stop();
        ioHook.removeAllListeners();
        !this.isWin && ioHook.unload();
      });

      let pos = this.getPos(robot.getMousePos());
      picker
        .getWindow()
        .setPosition(parseInt(pos.x) + 10, parseInt(pos.y) + 10);

      const img = robot.screen.capture(parseInt(pos.x) - 5, parseInt(pos.y) - 5, 9, 9);

      const colors = {}

      for (let i = 0; i < 9; i++) {
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

      ioHook.on('mousemove', e => {
        let {x, y} = this.getPos(e);
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
          new Notification({title: 'Rubick 通知', body: `${color} 已保存到剪切板`}).show();
          this.closePicker();
        }
      });

      ioHook.on('mouseup', e => {
        if (e.button === 3) {
          this.closePicker()
        }
      });
    });
  }

  closePicker() {
    if (picker.getWindow()) {
      ipcMain.removeListener("closePicker", this.closePicker);
      picker.getWindow().close();
    }
  }

  initTouchBar(mainWindow) {
    if (!commonConst.macOS()) return;
    const {TouchBarButton, TouchBarGroup, TouchBarPopover} = TouchBar;
    let items = [];
    let system = [];
    ipcMain.on('pluginInit', (e, args) => {
      this.optionPlugin = args;
      items = args.plugins.map((item) => {
        const iconPath = path.join(item.sourceFile, '../', item.logo);
        if (!fs.existsSync(iconPath)) return false;
        const icon = nativeImage.createFromPath(iconPath).resize({width: 20, height: 20});

        return new TouchBarButton({
          icon,
          click() {
            mainWindow.webContents.send('superPanel-openPlugin', {
              cmd: item.features[0].cmds.filter(cmd => typeof cmd === 'string')[0],
              plugin: item,
              feature: item.features[0],
            });
          }
        })
      }).filter(Boolean);

      system = args.plugins.map((item) => {
        if (item.type === 'system') {
          return new TouchBarButton({
            icon: nativeImage.createFromDataURL(item.logo).resize({width: 20, height: 20}),
            click() {
              mainWindow.webContents.send('superPanel-openPlugin', {
                cmd: item.features[0].cmds.filter(cmd => typeof cmd === 'string')[0],
                plugin: item,
                feature: item.features[0],
              });
            }
          });
        }
        return false;
      }).filter(Boolean);

      const plugin = new TouchBarPopover({
        items: new TouchBar({
          items,
        }),
        label: '已安装插件',
        showCloseButton: true
      });

      const monitor = new TouchBarPopover({
        items: mito.touchBar,
        label: '系统监控',
        showCloseButton: true
      });

      const touchBar = new TouchBar({
        items: [
          plugin,
          monitor,
          ...system
        ]
      });
      mainWindow.setTouchBar(touchBar);
      mito.start(mainWindow);
    });
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
    superPanel.init(mainWindow);
    ipcMain.on('right-down', async () => {

      const copyResult = await this.getSelectedContent();
      let win = superPanel.getWindow();

      win.webContents.send('trigger-super-panel', {
        ...copyResult,
        optionPlugin: this.optionPlugin.plugins,
      });
      const pos = this.getPos(robot.getMousePos());
      win.setPosition(parseInt(pos.x), parseInt(pos.y));
      win.setAlwaysOnTop(true);
      win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
      win.focus();
      win.setVisibleOnAllWorkspaces(false, {visibleOnFullScreen: true});
      win.show();
    });
  }

  getPos(point) {
    return this.isWin ? screen.screenToDipPoint({x: point.x, y: point.y}) : point;
  }

  reRegisterShortCut(mainWindow) {
    ipcMain.on('re-register', (event, arg) => {
      this.setAutoLogin();
      this.registerShortCut(mainWindow);
    });
  }

  setAutoLogin() {
    // 设置开机启动
    const config = global.opConfig.get();
    app.setLoginItemSettings({
      openAtLogin: config.perf.common.start,
      openAsHidden: true,
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
      if (process.platform === 'darwin') {
        spawn('/usr/sbin/screencapture', ["-c", "-i", "-r"], {detached: !0});
      }
      // todo win
    });
  }

  windowMoveInit(win) {
    let hasInit = false;
    ipcMain.on('window-move', () => {
      let bounds = win.getBounds();
      if (!hasInit) {
        hasInit = true;
        ioHook.start(false);
        !this.isWin && ioHook.load();

        const winPosition = win.getPosition();
        const winStartPosition = { x: winPosition[0], y: winPosition[1] };
        const mouseStartPosition = screen.getCursorScreenPoint();

        ioHook.on('mousedrag', e => {
          const cursorPosition = screen.getCursorScreenPoint();
          const dx = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
          const dy = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
          bounds.x = parseInt(dx);
          bounds.y = parseInt(dy);
          win.setBounds(bounds);
        });

        ioHook.on('mouseup', e => {
          hasInit = false;
          ioHook.stop();
          ioHook.removeAllListeners();
          !this.isWin && ioHook.unload();
        });
      }
    });
  }
}

export default Listener;
