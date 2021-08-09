import {app} from 'electron';
import './config';
import Listener from './listener';

export default function init(mainWindow) {
  const listener = new Listener();

  // 注册快捷键
  listener.registerShortCut(mainWindow);
  listener.init(mainWindow);

  mainWindow.once("ready-to-show", () => {
    // 非隐藏式启动需要显示主窗口
    if (!app.getLoginItemSettings().wasOpenedAsHidden) {
      mainWindow.show();
    }
  });

  // 打包后，失焦隐藏
  mainWindow.on('blur', () => {
    app.isPackaged && mainWindow.hide();
  });

}


