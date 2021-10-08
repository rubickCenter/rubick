import path from "path";
import fs from "fs";
import { getLocalDataFile } from "./utils";
import os from "os";
import { app } from "electron";

const configPath = path.join(getLocalDataFile(), "./rubick-config.json");

const defaultConfigForAnyPlatform = {
  version: 3,
  perf: {
    shortCut: {
      showAndHidden: "Option+R",
      separate: "Ctrl+D",
      quit: "Shift+Escape",
    },
    common: {
      start: true,
      space: true,
      // 是否失焦隐藏。默认在dev环境不隐藏，在打包后隐藏。
      hideOnBlur: app.isPackaged,
    },
    local: {
      search: true,
    },
  },
  superPanel: {
    baiduAPI: {
      key: "",
      appid: "",
    },
    mouseDownTime: 500,
  },
  global: [],
};

let defaultConfig = {
  Darwin: {
    ...defaultConfigForAnyPlatform,
  },
  Windows_NT: {
    ...defaultConfigForAnyPlatform,
  },
  Linux: {
    ...defaultConfigForAnyPlatform,
  },
};
global.opConfig = {
  config: null,
  get() {
    const platform = os.type();
    try {
      if (!opConfig.config) {
        opConfig.config = JSON.parse(
          fs.readFileSync(configPath) || JSON.stringify(defaultConfig[platform])
        );
      }
      // 重置
      if (
        !opConfig.config.version ||
        opConfig.config.version < defaultConfig[platform].version
      ) {
        opConfig.config = defaultConfig[platform];
        fs.writeFileSync(configPath, JSON.stringify(opConfig.config));
      }
      return opConfig.config;
    } catch (e) {
      opConfig.config = defaultConfig[platform];
      return opConfig.config;
    }
  },
  set(key, value) {
    opConfig.config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(opConfig.config));
  },
};
