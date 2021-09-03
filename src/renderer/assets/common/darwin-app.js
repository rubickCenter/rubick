import fs from "fs";
import path from "path";
import {nativeImage} from "electron";
import translate from "./translate";
import {APP_FINDER_PATH} from "./constans";
import iconvLite from "iconv-lite";
import bpList from "bplist-parser";

const fileLists = [];

const isZhRegex = /[\u4e00-\u9fa5]/;
const getDisplayNameRegex = /\"(?:CFBundleDisplayName)\"\s\=\s\"(.*)\"/;

async function getAppZhName(rootPath, appName) {
  try {
    const ERROR_RESULT = '';
    const systemPath = path.join(rootPath, `${appName}/Contents/Resources/zh_CN.lproj/InfoPlist.strings`);
    const customizePath = path.join(rootPath, `${appName}/Contents/Resources/zh-Hans.lproj/InfoPlist.strings`);
    let appInfoPath = '';

    if (fs.existsSync(systemPath)) {
      appInfoPath = systemPath;
    } else if (fs.existsSync(customizePath)) {
      appInfoPath = customizePath;
    } else {
      return ERROR_RESULT;
    }
    let appZhName = '';
    if (rootPath == '/Applications') {
      const container = iconvLite.decode(fs.readFileSync(appInfoPath), 'utf-16');
      if (container) {
        const res = container.match(getDisplayNameRegex);
        appZhName = res && res[1];
      } else {
        return ERROR_RESULT;
      }
    } else {
      const [{ CFBundleDisplayName = '', CFBundleName = '' }] = await bpList.parseFile(appInfoPath);
      appZhName = CFBundleDisplayName || CFBundleName;
    }

    return appZhName;
  } catch (error) {
    return ERROR_RESULT;
  }
}

function getDarwinAppList () {
  APP_FINDER_PATH.forEach((searchPath, index) => {
    fs.readdir(searchPath, async (err, files) => {
      try {
        for (let i = 0; i < files.length; i++) {
          const appName = files[i];
          const extname = path.extname(appName);
          const appSubStr = appName.split(extname)[0];
          if ((extname === '.app' || extname === '.prefPane') >= 0) {
            try {
              const path1 = path.join(searchPath, `${appName}/Contents/Resources/App.icns`);
              const path2 = path.join(searchPath, `${appName}/Contents/Resources/AppIcon.icns`);
              const path3 = path.join(searchPath, `${appName}/Contents/Resources/${appSubStr}.icns`);
              const path4 = path.join(searchPath, `${appName}/Contents/Resources/${appSubStr.replace(' ', '')}.icns`);
              let iconPath = path1;
              if (fs.existsSync(path1)) {
                iconPath = path1;
              } else if (fs.existsSync(path2)) {
                iconPath = path2;
              } else if (fs.existsSync(path3)) {
                iconPath = path3;
              } else if (fs.existsSync(path4)) {
                iconPath = path4;
              } else {
                // 性能最低的方式
                const resourceList = fs.readdirSync(path.join(searchPath, `${appName}/Contents/Resources`));
                const iconName = resourceList.filter((file) => path.extname(file) === '.icns')[0];
                iconPath = path.join(searchPath, `${appName}/Contents/Resources/${iconName}`);
              }
              const img = await nativeImage.createThumbnailFromPath(iconPath, { width: 64, height: 64 });

              const appZhName = await getAppZhName(searchPath, appName);

              const fileOptions = {
                value: 'plugin',
                icon: img.toDataURL(),
                desc: path.join(searchPath, appName),
                type: 'app',
                action: `open ${path.join(searchPath, appName).replace(' ', '\\ ')}`,
                keyWords: [appSubStr]
              };

              if (appZhName && isZhRegex.test(appZhName)) {
                const py = translate(appZhName);
                const pinyinArr = py.split(',');
                const firstLatter = pinyinArr.map(py => py[0]);
                // 拼音
                fileOptions.keyWords.push(pinyinArr.join(''));
                // 缩写
                fileOptions.keyWords.push(firstLatter.join(''));
                // 中文
                fileOptions.keyWords.push(appZhName);
              }

              fileLists.push({
                ...fileOptions,
                name: appSubStr,
                names: JSON.parse(JSON.stringify(fileOptions.keyWords)),
              });
            } catch (e) {}
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
}

export const getApp = {
  init: getDarwinAppList,
  fileLists,
}
