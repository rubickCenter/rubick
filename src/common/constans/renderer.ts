import { remote } from "electron";
import path from "path";

const appPath = remote.app.getPath("cache");

const PLUGIN_INSTALL_DIR = path.join(appPath, "./rubick-plugins");

export { PLUGIN_INSTALL_DIR };
