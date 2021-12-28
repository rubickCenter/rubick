import path from "path";
import fs from "fs";
import getLocalDataFile from "./getLocalDataFile";
import commonConst from "./commonConst";
import defaultConfigForAnyPlatform from "../constans/defaultConfig";

const configPath = path.join(getLocalDataFile(), "./rubick-config.json");

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
  set(value) {
    global.config = {
      ...global.config,
      ...value,
    };
    fs.writeFileSync(configPath, JSON.stringify(global.config));
  },
};
