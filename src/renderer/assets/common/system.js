import {shell, ipcRenderer} from 'electron';
export default {
  'rubick-help': {
    help() {
      shell.openExternal('https://cloudr-f2e.github.io/rubick/')
    }
  },
  'rubick-color': {
    pick() {
      ipcRenderer.send('start-picker')
    }
  },
  'rubick-screen-short-cut': {
    shortCut() {
      ipcRenderer.send('capture-screen', {type: 'start'})
    }
  },
  'rubick-lock': {
    lock() {
      ipcRenderer.send('lock-screen');
    }
  }
}
