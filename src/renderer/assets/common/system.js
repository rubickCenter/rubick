import {shell, ipcRenderer} from 'electron';
export default {
  'rubick-help': {
    help() {
      shell.openExternal('https://u.tools/docs/guide/about-uTools.html')
    }
  },
  'rubick-color': {
    pick() {
      ipcRenderer.send('start-picker')
    }
  }
}
