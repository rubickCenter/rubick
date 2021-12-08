import path from "path";
import fs from "fs";
import getLocalDataFile from "./getLocalDataFile";
import { app } from "electron";

const configPath = path.join(getLocalDataFile(), "./rubick-config.json");

const defaultConfigForAnyPlatform = {
  version: 1,
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
  global: [],
};

global.OP_CONFIG = {
  config: null,
  get() {
    try {
      if (!global.config) {
        global.config = JSON.parse(
          fs.readFileSync(configPath, "utf8") ||
            JSON.stringify(defaultConfigForAnyPlatform)
        );
      }
      // 重置
      if (
        !global.config.version ||
        global.config.version < defaultConfigForAnyPlatform.version
      ) {
        global.config = defaultConfigForAnyPlatform;
        fs.writeFileSync(
          configPath,
          JSON.stringify(defaultConfigForAnyPlatform)
        );
      }
      return global.config;
    } catch (e) {
      global.config = defaultConfigForAnyPlatform;
      return global.config;
    }
  },
  set(key, value) {
    global.config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(global.config));
  },
};
