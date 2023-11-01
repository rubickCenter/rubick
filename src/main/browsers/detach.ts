import { BrowserWindow, ipcMain, nativeTheme, screen } from 'electron';
import localConfig from '../common/initLocalConfig';
import commonConst from '@/common/utils/commonConst';
import path from 'path';
import { WINDOW_MIN_HEIGHT } from '@/common/constans/common';
import mainInstance from '@/main';
export default () => {
  let win: any;

  const init = async (pluginInfo, viewInfo, view) => {
    ipcMain.on('detach:service', async (event, arg: { type: string }) => {
      const data = await operation[arg.type]();
      event.returnValue = data;
    });
    const createWin = await createWindow(pluginInfo, viewInfo, view);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@electron/remote/main').enable(createWin.webContents);
  };

  const createWindow = async (pluginInfo, viewInfo, view) => {
    const createWin = new BrowserWindow({
      height: viewInfo.height,
      minHeight: WINDOW_MIN_HEIGHT,
      width: viewInfo.width,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 12, y: 21 },
      title: pluginInfo.pluginName,
      resizable: true,
      frame: true,
      show: false,
      enableLargerThanScreen: true,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c28' : '#fff',
      x: viewInfo.x,
      y: viewInfo.y,
      webPreferences: {
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        devTools: true,
        nodeIntegration: true,
        navigateOnDragDrop: true,
        spellcheck: false,
      },
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      createWin.loadURL('http://localhost:8082');
    } else {
      createWin.loadURL(`file://${path.join(__static, './detach/index.html')}`);
    }
    createWin.on('close', () => {
      executeHooks('PluginOut', null);
    });
    createWin.on('closed', () => {
      view.webContents?.destroy();
      win = undefined;
    });
    createWin.on('focus', () => {
      win = createWin;
      view && win.webContents?.focus();
    });

    createWin.once('ready-to-show', async () => {
      const config = await localConfig.getConfig();
      const darkMode = config.perf.common.darkMode;
      darkMode &&
        createWin.webContents.executeJavaScript(
          `document.body.classList.add("dark");window.rubick.theme="dark"`
        );
      view.setAutoResize({ width: true, height: true });
      createWin.setBrowserView(view);
      view.inDetach = true;
      createWin.webContents.executeJavaScript(
        `window.initDetach(${JSON.stringify(pluginInfo)})`
      );
      createWin.show();
    });

    // 最大化设置
    createWin.on('maximize', () => {
      createWin.webContents.executeJavaScript('window.maximizeTrigger()');
      const view = createWin.getBrowserView();
      if (!view) return;
      const display = screen.getDisplayMatching(createWin.getBounds());
      view.setBounds({
        x: 0,
        y: WINDOW_MIN_HEIGHT,
        width: display.workArea.width,
        height: display.workArea.height - WINDOW_MIN_HEIGHT,
      });
    });
    // 最小化
    createWin.on('unmaximize', () => {
      createWin.webContents.executeJavaScript('window.unmaximizeTrigger()');
      const view = createWin.getBrowserView();
      if (!view) return;
      const bounds = createWin.getBounds();
      const display = screen.getDisplayMatching(bounds);
      const width =
        (display.scaleFactor * bounds.width) % 1 == 0
          ? bounds.width
          : bounds.width - 2;
      const height =
        (display.scaleFactor * bounds.height) % 1 == 0
          ? bounds.height
          : bounds.height - 2;
      view.setBounds({
        x: 0,
        y: WINDOW_MIN_HEIGHT,
        width,
        height: height - WINDOW_MIN_HEIGHT,
      });
    });

    createWin.on('page-title-updated', (e) => {
      e.preventDefault();
    });
    createWin.webContents.once('render-process-gone', () => {
      createWin.close();
    });

    if (commonConst.macOS()) {
      createWin.on('enter-full-screen', () => {
        createWin.webContents.executeJavaScript(
          'window.enterFullScreenTrigger()'
        );
      });
      createWin.on('leave-full-screen', () => {
        createWin.webContents.executeJavaScript(
          'window.leaveFullScreenTrigger()'
        );
      });
    }

    view.webContents.on('before-input-event', (event, input) => {
      if (input.type !== 'keyDown') return;
      if (!(input.meta || input.control || input.shift || input.alt)) {
        if (input.key === 'Escape') {
          operation.endFullScreen();
        }
        return;
      }
    });

    const executeHooks = (hook, data) => {
      if (!view) return;
      const evalJs = `console.log(window.rubick);if(window.rubick && window.rubick.hooks && typeof window.rubick.hooks.on${hook} === 'function' ) {
          try {
            window.rubick.hooks.on${hook}(${data ? JSON.stringify(data) : ''});
          } catch(e) {console.log(e)}
        }
      `;
      view.webContents.executeJavaScript(evalJs);
    };
    return createWin;
  };

  const getWindow = () => win;

  const operation = {
    minimize: () => {
      win.focus();
      win.minimize();
    },
    maximize: () => {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close: () => {
      win.close();
    },
    endFullScreen: () => {
      win.isFullScreen() && win.setFullScreen(false);
    },
  };

  return {
    init,
    getWindow,
  };
};
