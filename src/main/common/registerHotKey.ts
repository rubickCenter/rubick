import { globalShortcut, BrowserWindow, screen, ipcMain, app} from "electron";

const registerHotKey = (mainWindow: BrowserWindow): void => {
  // 设置开机启动
  const setAutoLogin = () => {
    const config = global.OP_CONFIG.get();
    app.setLoginItemSettings({
      openAtLogin: config.perf.common.start,
      openAsHidden: true,
    });
  }

  const init = () => {
    setAutoLogin();
    const config = global.OP_CONFIG.get();
    globalShortcut.unregisterAll();
    // 注册偏好快捷键
    globalShortcut.register(config.perf.shortCut.showAndHidden, () => {
      const { x, y } = screen.getCursorScreenPoint();
      const currentDisplay = screen.getDisplayNearestPoint({ x, y });
      const wx = parseInt(
        String(
          currentDisplay.workArea.x + currentDisplay.workArea.width / 2 - 400
        )
      );
      const wy = parseInt(
        String(
          currentDisplay.workArea.y + currentDisplay.workArea.height / 2 - 200
        )
      );

      mainWindow.setAlwaysOnTop(true);
      mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      mainWindow.focus();
      mainWindow.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: true });
      mainWindow.setPosition(wx, wy);
      mainWindow.show();
    });

    // globalShortcut.register(config.perf.shortCut.separate, () => {
    //
    // });

    globalShortcut.register(config.perf.shortCut.quit, () => {
      // mainWindow.webContents.send('init-rubick');
      // mainWindow.show();
    });

    // 注册自定义全局快捷键
    config.global.forEach((sc) => {
      if (!sc.key || !sc.value) return;
      globalShortcut.register(sc.key, () => {
        mainWindow.webContents.send("global-short-key", sc.value);
      });
    });
  }
  init();
  ipcMain.on("re-register", () => {
    init();
  });
};
export default registerHotKey;
