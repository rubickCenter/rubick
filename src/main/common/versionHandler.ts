import { dialog, shell } from 'electron';
import pkg from '../../../package.json';
import { lt } from 'semver';
import { getLatestVersion } from './getLatestVersion';
const version = pkg.version;
const downloadUrl = 'https://github.com/rubickCenter/rubick/releases/latest';

const checkVersion = async () => {
  const res: string = await getLatestVersion();
  if (res !== '') {
    const latest = res;
    const result = compareVersion2Update(version, latest);
    if (result) {
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Rubick 更新提示',
          buttons: ['Yes', 'No'],
          message: `发现新版本 v${latest}，是否更新？`,
        })
        .then((res) => {
          if (res.response === 0) {
            // if selected yes
            shell.openExternal(downloadUrl);
          }
        });
    }
  } else {
    return false;
  }
};

// if true -> update else return false
const compareVersion2Update = (current: string, latest: string) => {
  try {
    if (latest.includes('beta')) {
      return false;
    }
    return lt(current, latest);
  } catch (e) {
    return false;
  }
};

export default checkVersion;
