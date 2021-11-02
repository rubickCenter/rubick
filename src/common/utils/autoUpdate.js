import axios from 'axios'
import { lt } from 'semver'
import { dialog, shell } from 'electron'
import pkg from '../../../package.json'
const os = require('os')

const version = pkg.version
const releaseUrl = 'http://118.195.176.247:8080/release/query'

export async function autoUpdate () {
  let res
  try {
    res = await axios.get(releaseUrl)
  } catch (err) {
    console.log(err)
  }
  if (res) {
    const latest = res.data.result[0]
    const result = compareVersion2Update(version, latest.version)
    if (result) {
      const res = await dialog.showMessageBox({
        type: 'info',
        title: '发现新版本',
        buttons: ['Yes', 'No'],
        message: `发现新版本${latest.version}，更新了很多功能，${latest.msg}, 是否去下载最新的版本？`,
        checkboxLabel: '以后不再提醒',
        checkboxChecked: false
      })
      if (res.response === 0) {
        if (os.type() === 'Windows_NT') {
          // windows
          await shell.openExternal(latest.downloadUrl)
        } else if (os.type() === 'Darwin') {
          // mac
          await shell.openExternal(latest.downloadUrl)
        } else {
          // 不支持提示
          dialog.showErrorBox('提示', '系统不支持')
        }
      }
    }
  }
}

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  return lt(current, latest)
}
