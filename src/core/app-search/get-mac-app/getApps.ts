import { spawn } from 'child_process';
import plist from 'plist';

export default function getApps(resolve, reject, filterByAppName = false) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let resultBuffer = new Buffer.from([]);

  const profileInstalledApps = spawn('/usr/sbin/system_profiler', [
    '-xml',
    '-detailLevel',
    'mini',
    'SPApplicationsDataType',
  ]);

  profileInstalledApps.stdout.on('data', (chunckBuffer) => {
    resultBuffer = Buffer.concat([resultBuffer, chunckBuffer]);
  });

  profileInstalledApps.on('exit', (exitCode) => {
    if (exitCode !== 0) {
      reject([]);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [installedApps] = plist.parse(resultBuffer.toString());
      if (!filterByAppName) return resolve(installedApps._items);
      return resolve(
        installedApps._items.filter((apps) => apps._name === filterByAppName)
          .length !== 0
      );
    } catch (err) {
      reject(err);
    }
  });

  profileInstalledApps.on('error', (err) => {
    reject(err);
  });
}
