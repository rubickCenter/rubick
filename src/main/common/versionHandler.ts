import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import pkg from '../../../package.json';
import { main } from '../browsers';

class VersionHandler {
  private lastestVersion: string;
  private currentVersion: string;
  private releaseNotes: string;
  private isUpdate: boolean;

  constructor() {
    this.lastestVersion = '';
    this.currentVersion = pkg.version;
    this.releaseNotes = '';
    this.isUpdate = false;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
  }

  checkForMacAndWindows() {
    let sendUpdateMsg = false;
    autoUpdater.removeAllListeners();
    // update-available 会触发多次,限制只通知一次
    autoUpdater.checkForUpdates();

    autoUpdater.on('download-progress', ({ percent }) => {
      console.log('下载进度', percent);
      // if (percent < 50) {
      // }
      this.isUpdate = true;
    });
    autoUpdater.on('update-available', (info) => {
      if (sendUpdateMsg) return;
      const { version, releaseName = 'normal', releaseNotes } = info;
      this.lastestVersion = version;

      sendUpdateMsg = true;

      autoUpdater.on('update-downloaded', () => {
        console.log('下载完成');
        this.isUpdate = false;
        if (releaseName === 'major') {
          autoUpdater.quitAndInstall(true, true);
        }
        const mainWindow = main().getWindow();
        dialog
          .showMessageBox(mainWindow, {
            title: '版本更新',
            message: `发现新版本${this.lastestVersion}，是否更新\n\n${releaseNotes}`,
            type: 'info',
            buttons: ['稍后提示', '立即更新'],
          })
          .then(({ response }) => {
            console.log(response);
            if (response === 1) {
              this.update();
            }
          });
      });

      // 自动下载安装包
      if (!this.isUpdate) {
        autoUpdater.downloadUpdate();
        console.log('download');
      }
    });
    autoUpdater.on('update-not-available', (info) => {
      if (sendUpdateMsg) return;
      sendUpdateMsg = true;
    });
    autoUpdater.on('error', () => {
      this.isUpdate = false;
    });
  }

  checkUpdate(): void {
    this.checkForMacAndWindows();
  }

  update() {
    let sendUpdateMsg = false;

    this.checkUpdate();

    autoUpdater.on('update-downloaded', () => {
      if (sendUpdateMsg) return;
      sendUpdateMsg = true;
      this.isUpdate = false;
      autoUpdater.quitAndInstall(true, true);
      // App.quit();
    });
  }
}

export default new VersionHandler();
