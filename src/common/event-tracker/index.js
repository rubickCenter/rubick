import { ipcMain } from 'electron';

const init = () => {
  ipcMain.on('msg-trigger', async (event, arg) => {

  });
}

export default () => {
  init();
}
