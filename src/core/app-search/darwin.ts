// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getMacApps from './get-mac-app';
import fs from 'fs';
import path from 'path';

import os from 'os';

const icondir = path.join(os.tmpdir(), 'ProcessIcon');

const exists = fs.existsSync(icondir);
if (!exists) {
  fs.mkdirSync(icondir);
}

const isZhRegex = /[\u4e00-\u9fa5]/;

async function getAppIcon(appPath: string, nativeImage: any, name: string) {
  try {
    const iconpath = path.join(icondir, `${name}.png`);
    const iconnone = path.join(icondir, `${name}.none`);
    const exists = fs.existsSync(iconpath);
    const existsnone = fs.existsSync(iconnone);
    if (exists) return true;
    if (existsnone) return false;
    // const appName: string = appPath.split('/').pop() || '';
    // const extname: string = path.extname(appName);
    // const appSubStr: string = appName.split(extname)[0];
    // const path1 = path.join(appPath, `/Contents/Resources/App.icns`);
    // const path2 = path.join(appPath, `/Contents/Resources/AppIcon.icns`);
    // const path3 = path.join(appPath, `/Contents/Resources/${appSubStr}.icns`);
    // const path4 = path.join(
    //   appPath,
    //   `/Contents/Resources/${appSubStr.replace(' ', '')}.icns`
    // );
    // let iconPath: string = path1;
    // if (fs.existsSync(path1)) {
    //   iconPath = path1;
    // } else if (fs.existsSync(path2)) {
    //   iconPath = path2;
    // } else if (fs.existsSync(path3)) {
    //   iconPath = path3;
    // } else if (fs.existsSync(path4)) {
    //   iconPath = path4;
    // } else {
    //   // 性能最低的方式
    //   const resourceList = fs.readdirSync(
    //     path.join(appPath, `/Contents/Resources`)
    //   );
    //   const iconName = resourceList.filter(
    //     (file) => path.extname(file) === '.icns'
    //   )[0];
    //   if (!iconName) {
    //     fs.writeFileSync(iconnone, '');
    //     return false;
    //   }
    //   iconPath = path.join(appPath, `/Contents/Resources/${iconName}`);
    // }
    await getMacApps.app2png(appPath, iconpath);
    return true;
  } catch (e) {
    return false;
  }
}

export default async (nativeImage: any) => {
  let apps: any = await getMacApps.getApps();

  apps = apps.filter((app: any) => {
    const extname = path.extname(app.path);
    return extname === '.app' || extname === '.prefPane';
  });
  for (const app of apps) {
    if (await getAppIcon(app.path, nativeImage, app._name)) {
      app.icon =
        'image://' +
        path.join(
          os.tmpdir(),
          'ProcessIcon',
          `${encodeURIComponent(app._name)}.png`
        );
    }
    // todo getApp size
  }
  apps = apps.filter((app: any) => !!app.icon);

  apps = apps.map((app: any) => {
    const appName: any = app.path.split('/').pop();
    const extname = path.extname(appName);
    const appSubStr = appName.split(extname)[0];
    let fileOptions = {
      ...app,
      value: 'plugin',
      desc: app.path,
      pluginType: 'app',
      action: `open ${app.path.replace(/ /g, '\\ ') as string}`,
      keyWords: [appSubStr],
    };

    if (app._name && isZhRegex.test(app._name)) {
      // const [, pinyinArr] = translate(app._name);
      // const firstLatter = pinyinArr.map((py) => py[0]);
      // // 拼音
      // fileOptions.keyWords.push(pinyinArr.join(''));
      // // 缩写
      // fileOptions.keyWords.push(firstLatter.join(''));
      // 中文
      fileOptions.keyWords.push(app._name);
    }

    fileOptions = {
      ...fileOptions,
      name: app._name,
      names: JSON.parse(JSON.stringify(fileOptions.keyWords)),
    };
    return fileOptions;
  });

  return apps;
};
