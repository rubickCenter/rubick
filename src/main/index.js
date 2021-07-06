import { app } from 'electron'
import '../renderer/store'
import init from './common/common';
import {autoUpdate} from './common/autoUpdate';
import createTray from './tray';
const {capture, main} = require("./browsers")();
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// to fix https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false;
app.dock.hide();

function createWindow() {
  capture.useCapture();
  main.init();
  init(main.getWindow());
}

app.on('ready', () => {
  createWindow()
  createTray(main.getWindow());
  autoUpdate();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  createWindow()
});

