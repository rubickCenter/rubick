import {newAdapterHandler} from 'rubick-core/packages/rubick-core'
import Localdb from 'rubick-core/packages/rubick-adapter-db'
import {app} from '@electron/remote'
// import path from 'path'
// import fs from 'fs'

const dbInstance = new Localdb({dbPath: app.getPath('cache'), dbName: 'rubick-main'})

export default class {
  constructor () {
    this.systemPlugins = []
    this.initPlugins = {
      'rubick-system-db': dbInstance
    }
    this.UIPlugins = []
    this.pluginInstance = null
    this.db = null
    this.baseDir = app.getPath('cache')
  }

  async init () {
    const adapterHandlerConfig = {
      baseDir: this.baseDir,
      registry: 'https://registry.npm.taobao.org',
      loglevel: 5,
      adapterInit: this.initPlugins,
      rubick: {}
    }
    // 创建系统插件管理并初始化
    const pluginInstance = await newAdapterHandler(adapterHandlerConfig)
    // const adapterPath = path.resolve(this.baseDir, 'package.json')
    // let sysPlugins = []
    // try {
    //   sysPlugins = Object.keys(JSON.parse(fs.readFileSync(adapterPath)).dependencies)
    // } catch (e) {}
    // pluginInstance.startAll(sysPlugins)
    // const systemPlugins = sysPlugins.map(plugin => {
    //   let info = {}
    //   try {
    //     info = JSON.parse(fs.readFileSync(path.resolve(adapterPath, 'node_modules', plugin, 'plugin.json')))
    //   } catch (e) {}
    //   return {
    //     name: plugin,
    //     path: path.resolve(adapterPath, 'node_modules', plugin),
    //     info
    //   }
    // })

    this.pluginInstance = pluginInstance
    // this.systemPlugins = systemPlugins
    this.db = await pluginInstance.api('rubick-system-db')
  }
}
