import {app} from 'electron';
import {getlocalDataFile, saveData, getData} from './common/utils';
import path from "path";

const appPath = path.join(getlocalDataFile());
const dbPath = path.join(appPath, './db.json');

export default {
  getPath(arg) {
    return app.getPath(arg.name);
  },
  hideMainWindow(arg, mainWindow) {
    console.log(111, mainWindow)
    mainWindow.hide();
  },
  showMainWindow(arg, mainWindow) {
    mainWindow.show();
  },
  onPluginEnter(arg) {
    return arg
  },
  setExpendHeight({height}, mainWindow) {
    console.log(height);
    mainWindow.setSize(788, height);
  },
  db: {
    put({data}) {
      data._rev = '';
      let dbData = getData(dbPath) || [];
      let target = [];
      console.log(data, dbData);
      dbData.some((d, i) => {
        if (d._id === data._id) {
          target = [d, i]
          return true;
        }
        return false;
      });

      // 更新
      if (target[0]) {
        dbData[target[1]] = data;
      } else {
        dbData.push(data);
      }
      saveData(dbPath, dbData);
      return {
        id: data.id,
        ok: true,
        rev: '',
      }
    },
    get({key}) {
      const dbData = getData(dbPath) || [];

      return dbData.find(d => d._id === key) || {};
    },
    remove({key}) {
      key = typeof key === 'object' ? key.id : key;
      let dbData = getData(dbPath);
      let find = false;
      dbData.some((d, i) => {
        if (d._id === key) {
          dbData.splice(i, 1);
          find = true;
          return true;
        }
        return false;
      });
      if (find) {
        saveData(dbPath, dbData);
        return {
          id: key,
          ok: true,
          rev: '',
        }
      } else {
        return {
          id: key,
          ok: false,
          rev: '',
        }
      }
    },
    bulkDocs({docs}) {
      const dbData = getData(dbPath);
      dbData.forEach((d, i) => {
        const result = docs.find(data => data._id === d._id);
        if (result) {
          dbData[i] = result;
        }
      });
      saveData(dbPath, dbData);
      return docs.map(d => ({
        id: d.id,
        success: true,
        rev: '',
      }))
    },
    allDocs({key}) {
      const dbData = getData(dbPath);
      const result = dbData.filter(d => d._id === key);
      return result;
    }
  }
}
