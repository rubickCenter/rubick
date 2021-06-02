import {BrowserWindow, globalShortcut, ipcMain} from 'electron';

export default function init(mainWindow) {
  ipcMain.on('changeWindowSize', (event, arg) => {
    mainWindow.setSize(arg.width || 788, arg.height);
  });

  mainWindow.on('blur', () => {
    // mainWindow.hide();
  });

  globalShortcut.register('Alt+R', () => {
    mainWindow.show();
  });
}


