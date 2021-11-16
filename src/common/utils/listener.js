import {ipcMain} from 'electron'
import {runner} from '../../main/browsers'

const Api = {
  windowCreator: null,
  openPlugin ({url, opts}) {
    if (!url) return
    Api.windowCreator = runner()
    Api.windowCreator.init(url, opts)
  }
}

export default class {
  init () {
    this.msgTrigger()
  }

  msgTrigger () {
    // 响应 preload.js 事件
    ipcMain.on('msg-trigger', async (event, arg) => {
      console.log(arg)
      const operators = arg.type.split('.')
      let fn = Api
      operators.forEach((op) => {
        fn = fn[op]
      })
      try {
        const data = await fn(arg)
        event.sender.send(`msg-back-${arg.type}`, data)
      } catch (e) {}
    })
  }
}
