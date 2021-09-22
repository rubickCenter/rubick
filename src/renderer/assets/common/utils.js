import { WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS } from './constans';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import downloadFile from 'download';
import { ipcRenderer } from 'electron';
import { getlocalDataFile } from '../../../main/common/utils';
import shell from 'shelljs';

const getApp = process.platform === 'win32' ? require('./win-app').getApp : require('./darwin-app').getApp;

const store = new Store();

getApp.init();
const fileLists = getApp.fileLists;

function getWindowHeight(searchList) {
  if (!searchList) return WINDOW_MAX_HEIGHT;
  if (!searchList.length) return WINDOW_MIN_HEIGHT;
  return searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5 > WINDOW_MAX_HEIGHT
    ? WINDOW_MAX_HEIGHT
    : searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5;
}

function searchKeyValues(lists, value) {
  return lists.filter((item) => {
    if (typeof item === 'string') return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    return item.type.toLowerCase().indexOf(value.toLowerCase()) >= 0;
  });
}

function existOrNot(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, async (err, stat) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const appPath = getlocalDataFile();

async function downloadZip(downloadRepoUrl, name) {
  try {
    const plugin_path = appPath;
    // 基础模版所在目录，如果是初始化，则是模板名称，否则是项目名称
    const temp_dest = `${plugin_path}/${name}`;
    // 下载模板
    if (await existOrNot(temp_dest)) {
      shell.rm('-rf', temp_dest);
    }

    await downloadFile(downloadRepoUrl, plugin_path, { extract: true });

    return temp_dest;
  } catch (e) {
    console.log(e);
  }
}

const sysFile = {
  savePlugins(plugins) {
    ipcRenderer.send('optionPlugin', {
      plugins: plugins.filter((plugin) => {
        let hasOption = false;
        plugin.features.forEach((fe) => {
          fe.cmds.forEach((cmd) => {
            if (cmd.type) {
              hasOption = true;
            }
          });
        });
        return hasOption;
      })
    });
    store.set('user-plugins', plugins);
  },
  getUserPlugins() {
    try {
      return store.get('user-plugins');
    } catch (e) {
      return [];
    }
  },
  removeAllPlugins() {
    store.delete('user-plugins');
  }
};

function mergePlugins(plugins) {
  const result = [
    ...plugins,
    ...SYSTEM_PLUGINS.map((plugin) => {
      return {
        ...plugin,
        status: true,
        sourceFile: '',
        type: 'system'
      };
    })
  ];

  const target = [];

  result.forEach((item, i) => {
    let targetIndex = -1;
    target.forEach((tg, j) => {
      if (tg.tag === item.tag && tg.type === 'system') {
        targetIndex = j;
      }
    });
    if (targetIndex === -1) {
      target.push(item);
    }
  });
  ipcRenderer &&
    ipcRenderer.send('optionPlugin', {
      plugins: target.filter((plugin) => {
        let hasOption = false;
        plugin.features.forEach((fe) => {
          fe.cmds.forEach((cmd) => {
            if (cmd.type) {
              hasOption = true;
            }
          });
        });
        return hasOption;
      })
    });
  ipcRenderer &&
  ipcRenderer.send('pluginInit', {
    plugins: target
  });
  return target;
}

function find(p, target = 'plugin.json') {
  try {
    let result;
    const fileList = fs.readdirSync(p);
    for (let i = 0; i < fileList.length; i++) {
      let thisPath = p + '/' + fileList[i];
      const data = fs.statSync(thisPath);

      if (data.isFile() && fileList[i] === target) {
        result = path.join(thisPath, '../');
        return result;
      }
      if (data.isDirectory()) {
        result = find(thisPath);
      }
    }
    return result;
  } catch (e) {
    console.log(e);
  }
}

function debounce(fn, delay) {
  let timer;
  return function() {
    const context = this;
    const args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

export { getWindowHeight, searchKeyValues, sysFile, mergePlugins, find, downloadZip, fileLists, debounce };
