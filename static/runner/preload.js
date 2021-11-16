const {
  ipcRenderer
} = require('electron')

window.rubick = {
  pluginInfo: {},
  setPluginInfo (pluginInfo) {
    console.log('aaa', pluginInfo)
    window.rubick.pluginInfo = pluginInfo
  },
  // 事件
  onPluginEnter (cb) {
    ipcRenderer.on('onPluginEnter', (e, message) => {
      // const feature = message.detail
      // cb({
      //   ...feature,
      //   type: message.cmd.type ? message.cmd.type : 'text',
      //   payload: message.payload
      // })
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
  }
}

window.rubick.showNotification('你好')
