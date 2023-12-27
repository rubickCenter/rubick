import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plist = require('simple-plist');

const getIconFile = (appFileInput) => {
  return new Promise((resolve, reject) => {
    const plistPath = path.join(appFileInput, 'Contents', 'Info.plist');
    plist.readFile(plistPath, (err, data) => {
      if (err || !data.CFBundleIconFile) {
        return resolve(
          '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns'
        );
      }
      const iconFile = path.join(
        appFileInput,
        'Contents',
        'Resources',
        data.CFBundleIconFile
      );
      const iconFiles = [iconFile, iconFile + '.icns', iconFile + '.tiff'];
      const existedIcon = iconFiles.find((iconFile) => {
        return fs.existsSync(iconFile);
      });
      resolve(
        existedIcon ||
          '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns'
      );
    });
  });
};

const tiffToPng = (iconFile, pngFileOutput) => {
  return new Promise((resolve, reject) => {
    exec(
      `sips -s format png '${iconFile}' --out '${pngFileOutput}' --resampleHeightWidth 64 64`,
      (error) => {
        error ? reject(error) : resolve(null);
      }
    );
  });
};

const app2png = (appFileInput, pngFileOutput) => {
  return getIconFile(appFileInput).then((iconFile) => {
    return tiffToPng(iconFile, pngFileOutput);
  });
};

export default app2png;
