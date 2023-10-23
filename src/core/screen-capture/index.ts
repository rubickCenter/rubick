import { clipboard, Notification } from 'electron';
import { execFile, exec } from 'child_process';
import platform from '@/common/utils/commonConst';
import path from 'path';

// 截图方法windows
export const screenWindow = (cb) => {
  const url = path.resolve(__static, 'ScreenCapture.exe');
  const screen_window = execFile(url);
  screen_window.on('exit', (code) => {
    if (code) {
      const image = clipboard.readImage();
      cb && cb(image.isEmpty() ? '' : image.toDataURL());
    }
  });
};

// 截图方法mac
export const handleScreenShots = (cb) => {
  exec('screencapture -i -r -c', () => {
    const image = clipboard.readImage();
    cb && cb(image.isEmpty() ? '' : image.toDataURL());
  });
};

export default (mainWindow, cb) => {
  // 接收到截图后的执行程序
  clipboard.writeText('');
  if (platform.macOS()) {
    handleScreenShots(cb);
  } else if (platform.windows()) {
    screenWindow(cb);
  } else {
    new Notification({
      title: '兼容性支持度不够',
      body: 'Linux 系统截图暂不支持，我们将会尽快更新！',
    }).show();
  }
};
