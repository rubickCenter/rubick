const {
  ipcRenderer
} = require('electron')
const path = require('path')

let filePath = ''
function getQueryVariable (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

if (location.href.indexOf('targetFile') > -1) {
  filePath = decodeURIComponent(getQueryVariable('targetFile'));
} else {
  filePath =
    process.platform === 'win32'
      ? location.pathname.replace('/', '')
      : location.pathname.replace('file://', '')
}

window.rubick = {
  pluginInfo: {},
  setPluginInfo (pluginInfo) {
    console.log('aaa', pluginInfo)
    window.rubick.pluginInfo = pluginInfo
    require(path.join(pluginInfo.plugin.path, 'preload.js'))
  },
  // 事件
  onPluginEnter (cb) {
    ipcRenderer.on('onPluginEnter', (e, message) => {
      console.log(message)
      const feature = message.feature
      // eslint-disable-next-line standard/no-callback-literal
      cb({
        ...feature,
        type: message.cmd.type ? message.cmd.type : 'text',
        payload: message.plugin
      })
    })
  },
  isDarkColors () {
    return false
  },
  onPluginReady (cb) {
    ipcRenderer.once('onPluginReady', (e, message) => {
      console.log(123123)
      const feature = message.detail
      // eslint-disable-next-line standard/no-callback-literal
      cb({
        ...feature,
        type: message.cmd.type ? message.cmd.type : 'text',
        payload: message.plugin
      })
    })
  },
  // 窗口交互
  hideMainWindow () {
    ipcRenderer.send('msg-trigger', {
      type: 'hideMainWindow'
    })
  },
  showMainWindow () {
    ipcRenderer.send('msg-trigger', {
      type: 'showMainWindow'
    })
  },
  showNotification (body, clickFeatureCode) {
    const myNotification = new Notification('Rubick 通知', {
      body
    })
    return myNotification
  },

  setSubInput (onChange, placeHolder, isFocus) {
    ipcRenderer.sendToHost('setSubInput', {
      placeHolder,
      isFocus
    })
    ipcRenderer.on(`msg-back-setSubInput`, (e, result) => {
      onChange({ text: result })
    })
  }
}

const preloadPath = getQueryVariable('preloadPath') || './preload.js'

require(path.join(filePath, '../', preloadPath))
