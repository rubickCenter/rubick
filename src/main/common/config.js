import path from "path"
import fs from 'fs'
import { getlocalDataFile } from "./utils"
import os from 'os'

const configPath = path.join(getlocalDataFile(), './rubick-config.json')

let defaultConfig = {
  Darwin: {
    version: 3,
    perf: {
      shortCut: {
        showAndHidden: 'Option+R',
        separate: 'Ctrl+D',
        quit: 'Shift+Escape'
      },
      common: {
        start: true,
        space: true,
      },
      local: {
        search: true,
      }
    },
    superPanel: {
      baiduAPI: {
        key: '',
        appid: '',
      },
      mouseDownTime: 500
    },
    global: []
  },
  Windows_NT: {
    version: 3,
    perf: {
      shortCut: {
        showAndHidden: 'Option+R',
        separate: 'Ctrl+D',
        quit: 'Shift+Escape'
      },
      common: {
        start: true,
        space: true,
      },
      local: {
        search: true,
      }
    },
    superPanel: {
      baiduAPI: {
        key: '',
        appid: '',
      },
      mouseDownTime: 500
    },
    global: []
  },
  Linux: {
    version: 3,
    perf: {
      shortCut: {
        showAndHidden: 'Option+R',
        separate: 'Ctrl+D',
        quit: 'Shift+Escape'
      },
      common: {
        start: true,
        space: true,
      },
      local: {
        search: true,
      }
    },
    superPanel: {
      baiduAPI: {
        key: '',
        appid: '',
      },
      mouseDownTime: 500
    },
    global: []
  }
}
global.opConfig = {
  config: null,
  get() {
    const platform = os.type();
    try {
      if (!opConfig.config) {
        opConfig.config = JSON.parse(fs.readFileSync(configPath) || JSON.stringify(defaultConfig[platform]))
      }
      // 重置
      if (!opConfig.config.version || opConfig.config.version < defaultConfig[platform].version) {
        opConfig.config = defaultConfig[platform]
        fs.writeFileSync(configPath, JSON.stringify(opConfig.config))
      }
      return opConfig.config
    } catch (e) {
      opConfig.config = defaultConfig[platform]
      return opConfig.config
    }
  },
  set(key, value) {
    opConfig.config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(opConfig.config))
  }
}

