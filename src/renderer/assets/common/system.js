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
  },
  'rubick-screen-short-cut': {
    shortCut() {
      ipcRenderer.send('capture-screen', {type: 'start'})
    }
  }
}
