import fs from 'fs';
import path from 'path';
import os from 'os';
import { shell } from 'electron';

const filePath = path.resolve(
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs'
);

const appData = path.join(os.homedir(), './AppData/Roaming');

const startMenu = path.join(
  appData,
  'Microsoft\\Windows\\Start Menu\\Programs'
);

interface AppInfo {
  value: string;
  desc: string;
  type: string;
  icon: string;
  pluginType: string;
  action: string;
  keyWords: string[];
  name: string;
  names: string[];
  match?: number[];
}

interface StartAppEntry {
  Name?: string;
  AppID?: string;
}

const fileLists: AppInfo[] = [];
const isZhRegex = /[\u4e00-\u9fa5]/;

const icondir = path.join(os.tmpdir(), 'ProcessIcon');
const exists = fs.existsSync(icondir);
if (!exists) {
  fs.mkdirSync(icondir);
}

const getico = (app: AppInfo): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fileIcon = require('extract-file-icon');
    const buffer = fileIcon(app.desc, 32);
    const iconpath = path.join(icondir, `${app.name}.png`);

    fs.exists(iconpath, (exists) => {
      if (!exists) {
        fs.writeFile(iconpath, buffer, 'base64', () => {
          //
        });
      }
    });
  } catch (e) {
    console.log(e, app.desc);
  }
};

function buildAppInfo(appName: string, targetPath: string): AppInfo {
  const keyWords = [appName];
  keyWords.push(path.basename(targetPath, '.exe'));

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
      .map((name) => name[0])
      .join('');
    keyWords.push(firstLatter);
  }

  const icon = path.join(
    os.tmpdir(),
    'ProcessIcon',
    `${encodeURIComponent(appName)}.png`
  );

  const appInfo = {
    value: 'plugin',
    desc: targetPath,
    type: 'app',
    icon,
    pluginType: 'app',
    action: `start "dummyclient" "${targetPath}"`,
    keyWords,
    name: appName,
    names: JSON.parse(JSON.stringify(keyWords)),
  };

  getico(appInfo);
  return appInfo;
}

function buildStartAppInfo(appName: string, appId: string): AppInfo {
  const keyWords = [appName];

  if (!isZhRegex.test(appName)) {
    const firstLatter = appName
      .split(' ')
      .map((name) => name[0])
      .join('');
    keyWords.push(firstLatter);
  }

  appId
    .split(/[\\/.!_-]+/)
    .filter(Boolean)
    .forEach((token) => keyWords.push(token));

  const icon = path.join(
    os.tmpdir(),
    'ProcessIcon',
    `${encodeURIComponent(appName)}.png`
  );

  return {
    value: 'plugin',
    desc: appId,
    type: 'app',
    icon,
    pluginType: 'app',
    action: `start "" "shell:AppsFolder\\${appId}"`,
    keyWords,
    name: appName,
    names: JSON.parse(JSON.stringify(keyWords)),
  };
}

function scanStartMenuDir(dirPath: string): Promise<AppInfo[]> {
  return new Promise((resolve) => {
    const results: AppInfo[] = [];

    const walk = (currentPath: string, done: () => void): void => {
      fs.readdir(currentPath, (err, files) => {
        if (err) {
          done();
          return;
        }

        let pending = files.length;
        if (!pending) {
          done();
          return;
        }

        files.forEach((filename) => {
          const filedir = path.join(currentPath, filename);
          fs.stat(filedir, (statErr, stats) => {
            if (!statErr) {
              if (stats.isDirectory()) {
                walk(filedir, () => {
                  if (--pending === 0) done();
                });
                return;
              }

              if (stats.isFile() && filedir.toLowerCase().endsWith('.lnk')) {
                let appDetail: { target?: string } = {};
                try {
                  appDetail = shell.readShortcutLink(filedir);
                } catch (e) {
                  //
                }

                if (
                  appDetail.target &&
                  appDetail.target.toLowerCase().indexOf('unin') < 0
                ) {
                  const appName = filename.split('.')[0];
                  results.push(buildAppInfo(appName, appDetail.target));
                }
              }
            } else {
              console.warn('获取文件stats失败');
            }

            if (--pending === 0) done();
          });
        });
      });
    };

    walk(dirPath, () => resolve(results));
  });
}

function getStartApps(): Promise<AppInfo[]> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { exec } = require('child_process');
    const ps = 'Get-StartApps | ConvertTo-Json -Compress';
    exec(
      `powershell -NoProfile -NonInteractive -Command "${ps}"`,
      { timeout: 8000 },
      (err, stdout) => {
        if (err || !stdout.trim()) {
          resolve([]);
          return;
        }

        try {
          const raw = JSON.parse(stdout.trim()) as StartAppEntry | StartAppEntry[];
          const apps: StartAppEntry[] = Array.isArray(raw) ? raw : [raw];
          const results = apps
            .filter((item) => item && item.Name && item.AppID)
            .map((item) =>
              buildStartAppInfo(item.Name as string, item.AppID as string)
            );
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      }
    );
  });
}

export default async (): Promise<AppInfo[]> => {
  const [systemApps, userApps, startApps] = await Promise.all([
    scanStartMenuDir(filePath),
    scanStartMenuDir(startMenu),
    getStartApps(),
  ]);

  const merged = [...startApps, ...systemApps, ...userApps];
  const seen = new Set<string>();
  fileLists.length = 0;
  merged.forEach((item) => {
    const key = `${item.name || ''}|${item.desc || ''}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      fileLists.push(item);
    }
  });

  return fileLists;
};
