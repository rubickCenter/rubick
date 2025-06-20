import dayjs from 'dayjs';
import { shell } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import extract from '@/common/utils/file-icon-extractor';

const filePath = path.resolve('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs');

const appData = path.join(os.homedir(), './AppData/Roaming');

const startMenu = path.join(appData, 'Microsoft\\Windows\\Start Menu\\Programs');

const fileLists: any = [];
const isZhRegex = /[\u4e00-\u9fa5]/;

const icondir = path.join(os.tmpdir(), 'ProcessIcon');
const exists = fs.existsSync(icondir);
if (!exists) {
  fs.mkdirSync(icondir);
}

const getico = async app => {
  try {
    const iconpath = path.join(icondir, `${app.name}.png`);
    const sourceExists = fs.existsSync(app.desc);
    if (!sourceExists) return;
    if (fs.existsSync(iconpath)) {
      const stats = fs.statSync(iconpath);
      if (dayjs(stats.mtime).format('YYYY-MM-DD HH:mm:ss') === app.ctime) {
        return;
      }
    }
    await extract(app.desc, iconpath, 'png')
      .then(() => {
        fs.utimesSync(iconpath, dayjs(app.ctime).toDate(), dayjs(app.ctime).toDate());
      })
      .catch(e => {});
  } catch (e) {
    console.log(e, app.desc);
  }
};

async function fileDisplay(filePath) {
  // 最大并发数
  const max = 5;
  //根据文件路径读取文件，返回文件列表
  const files = fs.readdirSync(filePath);
  while (files.length > 0) {
    const take = files.splice(0, max);
    const tasks = take.map(async filename => {
      const filedir = path.join(filePath, filename);
      const stats = fs.statSync(filedir);

      const isFile = stats.isFile(); // 是文件
      const isDir = stats.isDirectory(); // 是文件夹
      if (isFile) {
        const appName = filename.split('.')[0];
        const keyWords = [appName];
        let appDetail: any = {};
        try {
          appDetail = shell.readShortcutLink(filedir);
        } catch (e) {
          //
        }
        if (!appDetail.target || appDetail.target.toLowerCase().indexOf('unin') >= 0) return;

        // C:/program/cmd.exe => cmd
        keyWords.push(path.basename(appDetail.target, '.exe'));

        if (isZhRegex.test(appName)) {
          // const [, pinyinArr] = translate(appName);
          // const zh_firstLatter = pinyinArr.map((py) => py[0]);
          // // 拼音
          // keyWords.push(pinyinArr.join(''));
          // 缩写
          // keyWords.push(zh_firstLatter.join(''));
        } else {
          const firstLatter = appName
            .split(' ')
            .map(name => name[0])
            .join('');
          keyWords.push(firstLatter);
        }

        const icon = path.join(os.tmpdir(), 'ProcessIcon', `${encodeURIComponent(appName)}.png`);

        const appInfo = {
          value: 'plugin',
          desc: appDetail.target,
          type: 'app',
          icon,
          pluginType: 'app',
          ctime: dayjs(stats.ctime).format('YYYY-MM-DD HH:mm:ss'),
          action: `start "dummyclient" "${appDetail.target}"`,
          keyWords: keyWords,
          name: appName,
          names: JSON.parse(JSON.stringify(keyWords))
        };
        fileLists.push(appInfo);
        await getico(appInfo);
      }
      if (isDir) {
        await fileDisplay(filedir); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    });
    await Promise.all(tasks);
  }
}

export default async () => {
  const a = fileDisplay(filePath);
  const b = fileDisplay(startMenu);
  await Promise.all([a, b]);
  console.log('done');
  return fileLists;
};
