import {
  BrowserWindow,
  ipcMain,
  dialog,
  app,
  Notification,
  nativeImage,
  clipboard,
  screen,
  shell,
} from 'electron';
import fs from 'fs';
import { screenCapture } from '@/core';
import plist from 'plist';
import ks from 'node-key-sender';

import {
  DECODE_KEY,
  PLUGIN_INSTALL_DIR as baseDir,
} from '@/common/constans/main';
import getCopyFiles from '@/common/utils/getCopyFiles';
import common from '@/common/utils/commonConst';

import mainInstance from '../index';
import { runner, detach } from '../browsers';
import DBInstance from './db';
import getWinPosition from './getWinPosition';
import path from 'path';
import commonConst from '@/common/utils/commonConst';

const logCopyFile = (...messages: unknown[]) =>
  console.log('[copyFile]', ...messages);

const DROPFILES_HEADER_SIZE = 20;

type ClipboardExModule = typeof import('electron-clipboard-ex');

let clipboardExModule: ClipboardExModule | null = null;

const ensureClipboardEx = (): ClipboardExModule | null => {
  if (process.platform !== 'win32') return null;
  if (clipboardExModule) return clipboardExModule;
  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    clipboardExModule = require('electron-clipboard-ex');
    logCopyFile('Loaded electron-clipboard-ex successfully');
  } catch (error) {
    logCopyFile('Failed to load electron-clipboard-ex', error);
    clipboardExModule = null;
  }
  return clipboardExModule;
};

const buildWindowsFileListPayload = (files: string[]): Buffer => {
  return Buffer.from(`${files.join('\0')}\0\0`, 'utf16le');
};

const parseWindowsFileListPayload = (payload: Buffer): string[] => {
  if (!payload?.length) return [];
  const trimmed = payload.toString('utf16le').replace(/\0+$/, '');
  if (!trimmed) return [];
  return trimmed.split('\0').filter(Boolean);
};

const buildWindowsFileDropBuffer = (files: string[]): Buffer => {
  const payload = buildWindowsFileListPayload(files);
  const header = Buffer.alloc(DROPFILES_HEADER_SIZE);
  header.writeUInt32LE(DROPFILES_HEADER_SIZE, 0); // pFiles points to data offset
  header.writeInt32LE(0, 4); // pt.x
  header.writeInt32LE(0, 8); // pt.y
  header.writeUInt32LE(0, 12); // fNC
  header.writeUInt32LE(1, 16); // fWide => Unicode paths

  const result = Buffer.alloc(header.length + payload.length);
  for (let i = 0; i < header.length; i += 1) {
    result[i] = header[i];
  }
  for (let i = 0; i < payload.length; i += 1) {
    result[header.length + i] = payload[i];
  }
  return result;
};

const parseWindowsDropBuffer = (buffer: Buffer): string[] => {
  if (!buffer?.length || buffer.length < DROPFILES_HEADER_SIZE) {
    return [];
  }
  const offset = buffer.readUInt32LE(0);
  if (!offset || offset >= buffer.length) {
    return [];
  }
  const payload = buffer.subarray(offset);
  return parseWindowsFileListPayload(payload);
};

const buildDropEffectBuffer = (effect: 'copy' | 'move' | 'link' = 'copy') => {
  const effectMap = {
    copy: 1,
    move: 2,
    link: 4,
  } as const;
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(effectMap[effect], 0);
  return buffer;
};

const logAvailableFormats = (type: 'clipboard' | 'selection') => {
  try {
    logCopyFile(`availableFormats(${type})`, clipboard.availableFormats(type));
  } catch (error) {
    logCopyFile(`availableFormats(${type}) read failed`, error);
  }
};

const debugWindowsClipboard = (phase = 'afterWrite') => {
  logCopyFile('---- clipboard debug phase ----', phase);
  logAvailableFormats('clipboard');
  logAvailableFormats('selection');
  try {
    const drop = clipboard.readBuffer('CF_HDROP');
    logCopyFile('CF_HDROP length', drop.length);
    logCopyFile('CF_HDROP parsed', parseWindowsDropBuffer(drop));
  } catch (error) {
    logCopyFile('read CF_HDROP failed', error);
  }
  try {
    const fileNameW = clipboard.readBuffer('FileNameW');
    logCopyFile('FileNameW length', fileNameW.length);
    logCopyFile('FileNameW parsed', parseWindowsFileListPayload(fileNameW));
  } catch (error) {
    logCopyFile('read FileNameW failed', error);
  }
  try {
    const dropEffect = clipboard.readBuffer('Preferred DropEffect');
    logCopyFile('DropEffect length', dropEffect.length);
    logCopyFile(
      'DropEffect value',
      dropEffect.length ? dropEffect.readUInt32LE(0) : undefined
    );
  } catch (error) {
    logCopyFile('read Preferred DropEffect failed', error);
  }
};

const runnerInstance = runner();
const detachInstance = detach();

class API extends DBInstance {
  init(mainWindow: BrowserWindow) {
    // 响应 preload.js 事件
    ipcMain.on('msg-trigger', async (event, arg) => {
      const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
      const data = await this[arg.type](arg, window, event);
      event.returnValue = data;
      // event.sender.send(`msg-back-${arg.type}`, data);
    });
    // 按 ESC 退出插件
    mainWindow.webContents.on('before-input-event', (event, input) =>
      this.__EscapeKeyDown(event, input, mainWindow)
    );
  }

  public getCurrentWindow = (window, e) => {
    let originWindow = BrowserWindow.fromWebContents(e.sender);
    if (originWindow !== window) originWindow = detachInstance.getWindow();
    return originWindow;
  };

  public __EscapeKeyDown = (event, input, window) => {
    if (input.type !== 'keyDown') return;
    if (!(input.meta || input.control || input.shift || input.alt)) {
      if (input.key === 'Escape') {
        if (this.currentPlugin) {
          this.removePlugin(null, window);
        } else {
          mainInstance.windowCreator.getWindow().hide();
        }
      }

      return;
    }
  };

  public windowMoving({ data: { mouseX, mouseY, width, height } }, window, e) {
    const { x, y } = screen.getCursorScreenPoint();
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.setBounds({ x: x - mouseX, y: y - mouseY, width, height });
    getWinPosition.setPosition(x - mouseX, y - mouseY);
  }

  public loadPlugin({ data: plugin }, window) {
    window.webContents.executeJavaScript(
      `window.loadPlugin(${JSON.stringify(plugin)})`
    );
    this.openPlugin({ data: plugin }, window);
  }

  public openPlugin({ data: plugin }, window) {
    if (plugin.platform && !plugin.platform.includes(process.platform)) {
      return new Notification({
        title: `插件不支持当前 ${process.platform} 系统`,
        body: `插件仅支持 ${plugin.platform.join(',')}`,
        icon: plugin.logo,
      }).show();
    }
    window.setSize(window.getSize()[0], 60);
    this.removePlugin(null, window);
    // 模板文件
    if (!plugin.main) {
      plugin.tplPath = common.dev()
        ? 'http://localhost:8083/#/'
        : `file://${__static}/tpl/index.html`;
    }
    if (plugin.name === 'rubick-system-feature') {
      plugin.logo = plugin.logo || `file://${__static}/logo.png`;
      plugin.indexPath = commonConst.dev()
        ? 'http://localhost:8081/#/'
        : `file://${__static}/feature/index.html`;
    } else if (!plugin.indexPath) {
      const pluginPath = path.resolve(baseDir, 'node_modules', plugin.name);
      plugin.indexPath = `file://${path.join(
        pluginPath,
        './',
        plugin.main || ''
      )}`;
    }
    runnerInstance.init(plugin, window);
    this.currentPlugin = plugin;
    window.webContents.executeJavaScript(
      `window.setCurrentPlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin,
      })})`
    );
    window.show();
    const view = runnerInstance.getView();
    if (!view.inited) {
      view.webContents.on('before-input-event', (event, input) =>
        this.__EscapeKeyDown(event, input, window)
      );
    }
  }

  public removePlugin(e, window) {
    runnerInstance.removeView(window);
    this.currentPlugin = null;
  }

  public openPluginDevTools() {
    runnerInstance.getView().webContents.openDevTools({ mode: 'detach' });
  }

  public hideMainWindow(arg, window) {
    window.hide();
  }

  public showMainWindow(arg, window) {
    window.show();
  }

  public showOpenDialog({ data }, window) {
    return dialog.showOpenDialogSync(window, data);
  }

  public showSaveDialog({ data }, window) {
    return dialog.showSaveDialogSync(window, data);
  }

  public setExpendHeight({ data: height }, window: BrowserWindow, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    const targetHeight = height;
    originWindow.setSize(originWindow.getSize()[0], targetHeight);
    const screenPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(screenPoint);
    const position =
      originWindow.getPosition()[1] + targetHeight > display.bounds.height
        ? height - 60
        : 0;
    originWindow.webContents.executeJavaScript(
      `window.setPosition && typeof window.setPosition === "function" && window.setPosition(${position})`
    );
  }

  public setSubInput({ data }, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInput(${JSON.stringify({
        placeholder: data.placeholder,
      })})`
    );
  }

  public subInputBlur() {
    runnerInstance.getView().webContents.focus();
  }

  public sendSubInputChangeEvent({ data }) {
    runnerInstance.executeHooks('SubInputChange', data);
  }

  public removeSubInput(data, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(`window.removeSubInput()`);
  }

  public setSubInputValue({ data }, window, e) {
    const originWindow = this.getCurrentWindow(window, e);
    if (!originWindow) return;
    originWindow.webContents.executeJavaScript(
      `window.setSubInputValue(${JSON.stringify({
        value: data.text,
      })})`
    );
    this.sendSubInputChangeEvent({ data });
  }

  public getPath({ data }) {
    return app.getPath(data.name);
  }

  public showNotification({ data: { body } }) {
    if (!Notification.isSupported()) return;
    'string' != typeof body && (body = String(body));
    const plugin = this.currentPlugin;
    const notify = new Notification({
      title: plugin ? plugin.pluginName : null,
      body,
      icon: plugin ? plugin.logo : null,
    });
    notify.show();
  }

  public copyImage = ({ data }) => {
    const image = nativeImage.createFromDataURL(data.img);
    clipboard.writeImage(image);
  };

  public copyText({ data }) {
    clipboard.writeText(String(data.text));
    return true;
  }

  public copyFile({ data }) {
    const input = data?.file;
    logCopyFile('Input received', { input, platform: process.platform });
    const candidateFiles = Array.isArray(input)
      ? input
      : typeof input === 'string'
      ? [input]
      : [];
    logCopyFile('Candidate files', candidateFiles);

    const targetFiles = candidateFiles
      .map((filePath) =>
        typeof filePath === 'string' ? filePath.trim() : ''
      )
      .filter((filePath) => {
        if (!filePath) return false;
        try {
          return fs.existsSync(filePath);
        } catch {
          return false;
        }
      });

    if (!targetFiles.length) {
      logCopyFile('No valid files detected, abort copy');
      return false;
    }

    if (process.platform === 'darwin') {
      try {
        clipboard.writeBuffer(
          'NSFilenamesPboardType',
          Buffer.from(plist.build(targetFiles))
        );
        logCopyFile('macOS clipboard write succeeded', targetFiles);
      } catch (error) {
        logCopyFile('macOS clipboard write failed', error);
        return false;
      }
      return true;
    }

    if (process.platform === 'win32') {
      const normalizedFiles = targetFiles.map((filePath) => {
        const normalized = path.normalize(filePath);
        logCopyFile('Normalized path', { original: filePath, normalized });
        return normalized;
      });

      const clipboardExInstance = ensureClipboardEx();
      if (clipboardExInstance) {
        try {
          const writeResult = clipboardExInstance.writeFilePaths(normalizedFiles);
          logCopyFile('clipboard-ex write result', writeResult);
          const readBack = clipboardExInstance.readFilePaths();
          logCopyFile('clipboard-ex readback', readBack);
          if (writeResult.length === normalizedFiles.length) {
            logCopyFile('clipboard-ex copied all files, skipping Electron fallback');
            return true;
          }
          logCopyFile(
            'clipboard-ex copied fewer files than requested, continue with Electron fallback'
          );
        } catch (error) {
          logCopyFile('clipboard-ex write failed, continue with Electron fallback', error);
        }
      } else {
        logCopyFile('clipboard-ex not available, continue with Electron fallback');
      }

      try {
        clipboard.writeBuffer(
          'CF_HDROP',
          buildWindowsFileDropBuffer(normalizedFiles)
        );
        clipboard.writeBuffer(
          'FileNameW',
          buildWindowsFileListPayload(normalizedFiles)
        );
        clipboard.writeBuffer(
          'Preferred DropEffect',
          buildDropEffectBuffer('copy')
        );
        logCopyFile('Electron clipboard write finished', normalizedFiles);
      } catch (error) {
        logCopyFile('Electron clipboard write failed', error);
      }

      debugWindowsClipboard('afterElectronWrite');

      let dropBufferLength = 0;
      try {
        dropBufferLength = clipboard.readBuffer('CF_HDROP').length;
      } catch (error) {
        logCopyFile('Failed to read CF_HDROP after Electron write', error);
        return false;
      }
      if (!dropBufferLength) {
        logCopyFile('CF_HDROP buffer is empty after Electron write, copy failed');
        return false;
      }
      logCopyFile('CF_HDROP buffer detected after Electron write, copy succeeded');
      return true;
    }

    logCopyFile('Current platform is not supported yet');
    return false;
  }

  public getFeatures() {
    return this.currentPlugin?.features;
  }

  public setFeature({ data }, window) {
    this.currentPlugin = {
      ...this.currentPlugin,
      features: (() => {
        let has = false;
        this.currentPlugin.features.some((feature) => {
          has = feature.code === data.feature.code;
          return has;
        });
        if (!has) {
          return [...this.currentPlugin.features, data.feature];
        }
        return this.currentPlugin.features;
      })(),
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin,
      })})`
    );
    return true;
  }

  public removeFeature({ data }, window) {
    this.currentPlugin = {
      ...this.currentPlugin,
      features: this.currentPlugin.features.filter((feature) => {
        if (data.code.type) {
          return feature.code.type !== data.code.type;
        }
        return feature.code !== data.code;
      }),
    };
    window.webContents.executeJavaScript(
      `window.updatePlugin(${JSON.stringify({
        currentPlugin: this.currentPlugin,
      })})`
    );
    return true;
  }

  public sendPluginSomeKeyDownEvent({ data: { modifiers, keyCode } }) {
    const code = DECODE_KEY[keyCode];
    if (!code || !runnerInstance.getView()) return;
    if (modifiers.length > 0) {
      runnerInstance.getView().webContents.sendInputEvent({
        type: 'keyDown',
        modifiers,
        keyCode: code,
      });
    } else {
      runnerInstance.getView().webContents.sendInputEvent({
        type: 'keyDown',
        keyCode: code,
      });
    }
  }

  public detachPlugin(e, window) {
    if (!this.currentPlugin) return;
    const view = window.getBrowserView();
    window.setBrowserView(null);
    window.webContents
      .executeJavaScript(`window.getMainInputInfo()`)
      .then((res) => {
        detachInstance.init(
          {
            ...this.currentPlugin,
            subInput: res,
          },
          window.getBounds(),
          view
        );
        window.webContents.executeJavaScript(`window.initRubick()`);
        window.setSize(window.getSize()[0], 60);
        this.currentPlugin = null;
      });
  }

  public detachInputChange({ data }) {
    this.sendSubInputChangeEvent({ data });
  }

  public getLocalId() {
    return encodeURIComponent(app.getPath('home'));
  }

  public shellShowItemInFolder({ data }) {
    shell.showItemInFolder(data.path);
    return true;
  }

  public async getFileIcon({ data }) {
    const nativeImage = await app.getFileIcon(data.path, { size: 'normal' });
    return nativeImage.toDataURL();
  }

  public shellBeep() {
    shell.beep();
    return true;
  }

  public screenCapture(arg, window) {
    screenCapture(window, (img) => {
      runnerInstance.executeHooks('ScreenCapture', {
        data: img,
      });
    });
  }

  public getCopyFiles() {
    return getCopyFiles();
  }

  public simulateKeyboardTap({ data: { key, modifier } }) {
    let keys = [key.toLowerCase()];
    if (modifier && Array.isArray(modifier) && modifier.length > 0) {
      keys = modifier.concat(keys);
      ks.sendCombination(keys);
    } else {
      ks.sendKeys(keys);
    }
  }

  public addLocalStartPlugin({ data: { plugin } }, window) {
    window.webContents.executeJavaScript(
      `window.addLocalStartPlugin(${JSON.stringify({
        plugin,
      })})`
    );
  }

  public removeLocalStartPlugin({ data: { plugin } }, window) {
    window.webContents.executeJavaScript(
      `window.removeLocalStartPlugin(${JSON.stringify({
        plugin,
      })})`
    );
  }
}

export default new API();
