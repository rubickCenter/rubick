import { app, BrowserWindow, protocol } from "electron";
import path from "path";
export default () => {
  let win: any;

  const init = (pluginInfo, viewInfo, view) => {
    createWindow(pluginInfo, viewInfo, view);
  };

  const createWindow = async (pluginInfo, viewInfo, view) => {
    win = new BrowserWindow({
      height: viewInfo.height,
      width: viewInfo.width,
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 12, y: 21 },
      title: pluginInfo.pluginName,
      resizable: true,
      frame: true,
      show: false,
      enableLargerThanScreen: true,
      x: viewInfo.x,
      y: viewInfo.y,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true,
      },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL("http://localhost:8082");
    } else {
      win.loadURL(`file://${path.join(__static, "./detach/index.html")}`);
    }

    win.on("closed", () => {
      win = undefined;
    });

    win.once("ready-to-show", () => {
      win.setBrowserView(view);
      win.webContents.executeJavaScript(`window.initDetach(${JSON.stringify(pluginInfo)})`)
      win.show();
    });
  };

  const getWindow = () => win;

  return {
    init,
    getWindow,
  };
};
