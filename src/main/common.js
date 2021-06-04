import {globalShortcut, ipcMain} from 'electron';
import Api from './api';

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

  ipcMain.on('msg-trigger', async (event, arg) => {
    const data = Api[arg.type](arg, mainWindow);
    event.sender.send(`msg-back-${arg.type}`, data);
  });
}


