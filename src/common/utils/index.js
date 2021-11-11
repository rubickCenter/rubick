import fs from 'fs'
import path from 'path'
const getWindowHeight = () => {}
const searchKeyValues = () => {}
const fileLists = []
const downloadZip = () => {}
const find = () => {}

const commonConst = {
  linux () {
    return process.platform === 'linux'
  },
  macOS () {
    return process.platform === 'darwin'
  },
  windows () {
    return process.platform === 'win32'
  },
  production () {
    return process.env.NODE_ENV !== 'development'
  },
  dev () {
    return process.env.NODE_ENV === 'development'
  }
}

const getLocalDataFile = () => {
  let localDataFile = process.env.HOME
  if (!localDataFile) {
    localDataFile = process.env.LOCALAPPDATA
  }
  return localDataFile
}

function existOrNot (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, async (err, stat) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

function debounce (fn, delay) {
  let timer
  return function () {
    const context = this
    const args = arguments

    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

function mergePlugins (origin, target) {
  const diff = target.filter(t => {
    let has = false
    origin.some(o => {
      if (t._name === o._name) {
        has = true
      }
      return has
    })
    return !has
  })

  return JSON.parse(JSON.stringify(origin.concat(diff)))
}

function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

export {
  getWindowHeight,
  debounce,
  searchKeyValues,
  fileLists,
  commonConst,
  downloadZip,
  find,
  getLocalDataFile,
  existOrNot,
  mergePlugins,
  mkdirsSync
}
