import {
  globalShortcut,
  ipcMain,
  BrowserWindow,
  clipboard,
  Notification,
} from 'electron';
import Api from './api';
import robot from 'robotjs';

const browsers = require("../browsers")();
const mouseEvents = require("osx-mouse");
const {picker, separator} = browsers;

let closePicker = (newColor) => {
  if (picker.getWindow()) {
    ipcMain.removeListener("closePicker", closePicker);
    ipcMain.removeListener("pickerRequested", (event) => {});
    picker.getWindow().close();
  }
};

export default function init(mainWindow) {
  const mouseTrack = mouseEvents();
  let down_time = 0;
  mouseTrack.on('right-down', () => {
    down_time = Date.now();
  })
  mouseTrack.on('right-up', () => {
    if ((Date.now() - down_time) > 1000) {
      new Notification({ title: 'Rubick 通知', body: '长按了' }).show();
    }
  });

  ipcMain.on('changeWindowSize-rubick', (event, arg) => {
    mainWindow.setSize(arg.width || 800, arg.height);
  });

  mainWindow.on('blur', () => {
    // mainWindow.hide();
  });

  globalShortcut.register('Alt+R', () => {
    mainWindow.show();
  });

  ipcMain.on('init-shortcut', (event) => {
    globalShortcut.register('ctrl+d', () => {
      event.sender.send('new-window');
    });
  })


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

  ipcMain.on('new-window', (event, arg) => {
    const opts = {
      ...arg,
      searchType: 'subWindow',
    }
    separator.init(opts);
  });

  ipcMain.on('start-picker', () => {
    const mouseTrack = mouseEvents();
    picker.init();
    picker.getWindow().on("close", () => {
      mouseTrack.destroy();
    });
    mouseTrack.on('move', (x, y) => {
      if (!picker.getWindow()) return;
      let color = "#" + robot.getPixelColor(parseInt(x), parseInt(y));
      picker.getWindow().setPosition(parseInt(x) - 50, parseInt(y) - 50);
      picker.getWindow().webContents.send("updatePicker", color);
    })
    mouseTrack.on("left-up", (x, y) => {
      const color = "#" + robot.getPixelColor(parseInt(x), parseInt(y));
      clipboard.writeText("#" + robot.getPixelColor(parseInt(x), parseInt(y)));
      new Notification({ title: 'Rubick 通知', body: `${color} 已保存到剪切板` }).show();
      closePicker();
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
    mouseTrack.on("right-up", closePicker);
  })
}


