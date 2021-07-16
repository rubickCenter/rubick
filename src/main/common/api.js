import {app, BrowserWindow, dialog} from 'electron';

const puppeteer = require("puppeteer-core");
const pie = require("puppeteer-in-electron")


let browser
pie.initialize(app).then(res => {
  pie.connect(app, puppeteer).then(b => {
    browser = b;
  })
})

export default {
  getPath(arg) {
    return app.getPath(arg.name);
  },
  hideMainWindow(arg, mainWindow) {
    mainWindow.hide();
  },
  showMainWindow(arg, mainWindow) {
    mainWindow.show();
  },
  showOpenDialog({options}) {
    return JSON.parse(JSON.stringify(dialog.showOpenDialogSync(options)));
  },
  onPluginEnter(arg) {
    return arg
  },
  setExpendHeight({height}, mainWindow) {
    mainWindow.setSize(800, height || 60);
  },

  ubrowser: {
    goto: async ({winId}) => {
      const win = BrowserWindow.fromId(winId);
      await win.loadURL(url);
    },
    async value({selector, value, winId}) {
      const win = BrowserWindow.fromId(winId);
      const page = await pie.getPage(browser, win);
      const nd = await page.$(selector);
      nd.type(value);
    },

    async click({selector, winId}) {
      const win = BrowserWindow.fromId(winId);
      const page = await pie.getPage(browser, win);
      const nd = await page.$(selector);
      nd.click();
    },

    async run(options) {
      const win = BrowserWindow.fromId(options.winId);
      win.setSize(options.width || 800, options.height || 600)
      win.once('ready-to-show', () => win.show());
    },
  }
}
