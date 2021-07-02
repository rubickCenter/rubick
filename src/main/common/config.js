import path from "path";
import fs from 'fs';
import {getlocalDataFile} from "./utils";
import os from 'os';

const configPath = path.join(getlocalDataFile(), './rubick-config.json');

let defaultConfig = {
  Darwin: {
    perf: {
      shortCut: {
        showAndHidden: 'Option+R',
        separate: 'Ctrl+D'
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
    }
  }
}
global.opConfig = {
  config: null,
  get() {
    const platform = os.type();
    try {
      if (!opConfig.config) {
        opConfig.config = JSON.parse(fs.readFileSync(configPath) || JSON.stringify(defaultConfig[platform]));
      }
      return opConfig.config;
    } catch (e) {
      opConfig.config = defaultConfig[platform]
      return opConfig.config;
    }
  },
  set(key, value) {
    opConfig.config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(opConfig.config));
  }
}

