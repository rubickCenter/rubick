import {WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS} from './constans';
import download from 'download-git-repo';
import path from 'path';
import fs from 'fs';
import process from 'child_process';
import Store from 'electron-store';

const store = new Store();

function getWindowHeight(searchList) {
  if (!searchList) return WINDOW_MAX_HEIGHT;
  if (!searchList.length) return WINDOW_MIN_HEIGHT;
  return searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5 > WINDOW_MAX_HEIGHT ?  WINDOW_MAX_HEIGHT : searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5;
}

function searchKeyValues(lists, value){
  return lists.filter(item => {
    if (typeof item === 'string') return item.indexOf(value) >= 0;
    return item.type.indexOf(value) >= 0;
  })
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

function mkdirFolder(name) {
  return new Promise((resolve, reject) => {
    process.exec(`mkdir ${name}`, async function (error, stdout, stderr) {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    })
  });
}

function downloadFunc(downloadRepoUrl, name) {
  const targetGit = downloadRepoUrl ? downloadRepoUrl : `github:clouDr-f2e/${name}`;
  const plugin_path = path.join(__static, './plugins');

  return new Promise(async (resolve, reject) => {
    try {
      if (!(await existOrNot(plugin_path))) {
        await mkdirFolder(plugin_path);
      }
      // 基础模版所在目录，如果是初始化，则是模板名称，否则是项目名称
      const temp_dest = `${plugin_path}/${name}`;
      // 下载模板
      if (await existOrNot(temp_dest)) {
        await process.execSync(`rm -rf ${temp_dest}`);
      }

      download(targetGit, temp_dest, {clone: true}, function (err) {
        console.log(err ? 'Error' : 'Success')
        if (err) {
          console.log(err);
          reject('请求模板下载失败');
        } else {
          resolve('请求模板下载成功');
        }
      })
    } catch (e) {
      console.log(e);
    }

  });
}

const sysFile = {
  savePlugins(plugins) {
    store.set('user-plugins', plugins);
  },
  getUserPlugins() {
    try {
      console.log(store.get('user-plugins').devPlugins)
      return store.get('user-plugins').devPlugins;
    } catch (e) {
      return []
    }
  },
  removeAllPlugins() {
    store.delete('user-plugins');
  }
}

function mergePlugins(plugins) {
  return [
    ...plugins,
    ...SYSTEM_PLUGINS.map(plugin => {
      return {
        ...plugin,
        status: true,
        sourceFile: '',
        type: 'system',
      }
    }),
  ]
}

function find(p) {
  try {
    let result;
    const fileList = fs.readdirSync(p);
    for (let i = 0; i < fileList.length; i++) {
      let thisPath = p + "/" + fileList[i];
      const data = fs.statSync(thisPath);

      if (data.isFile() && fileList[i] === 'plugin.json') {
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

export {
  getWindowHeight,
  searchKeyValues,
  downloadFunc,
  sysFile,
  mergePlugins,
  find,
}
