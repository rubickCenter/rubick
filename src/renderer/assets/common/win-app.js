import path from "path";
import os from 'os';
import child from 'child_process';
import iconv from 'iconv-lite';

const fileLists = [];

const powershell = (cmd, callback) => {
  const ps = child.spawn('powershell', ['-NoProfile', '-Command', cmd], { encoding: 'buffer' })
  let chunks = [];
  let err_chunks = [];
  ps.stdout.on('data', chunk => {
    chunks.push(iconv.decode(chunk, 'cp936'))
  })
  ps.stderr.on('data', err_chunk => {
    err_chunks.push(iconv.decode(err_chunk, 'cp936'))
  })
  ps.on('close', code => {
    let stdout = chunks.join("");
    let stderr = err_chunks.join("");
    callback(stdout, stderr)
  })
}

const getWinAppList = () => {
  let filterValues = "Select-Object DisplayName,DisplayIcon,UninstallString,DisplayVersion,InstallDate,Publisher,InstallLocation"
  let localMatcine = `Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
  let currentUser = `Get-ItemProperty HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
  let Wow6432Node = `Get-ItemProperty HKLM:\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ${filterValues}`;
  let x64 = process.arch === 'x64' ? `;${Wow6432Node}` : '';
  powershell(`${localMatcine};${currentUser}${x64}`, (stdout, stderr) => {
    let applist = [];
    let apps = stdout.trim().replace(/\r\n[ ]{10,}/g,"").split('\r\n\r\n');
    for (var app of apps) {
      const dict = {}
      let lines = app.split('\r\n')
      for (var line of lines) {
        if (line) {
          const key = line.split(/\s+:\s*/)[0];
          const value = line.split(/\s+:\s*/)[1];
          dict[key] = value;
        }
      }
      if (dict.DisplayName && dict.DisplayIcon && dict.DisplayIcon.indexOf('.exe') >= 0) {
        dict.LegalName = dict.DisplayName.replace(/[\\\/\:\*\?\"\<\>\|]/g, "");
        dict.Icon =  path.join(os.tmpdir(), 'ProcessIcon', `${encodeURIComponent(dict.LegalName)}.png`);
        const appPath = dict.DisplayIcon.split(',')[0];
        fileLists.push({
          ...dict,
          value: 'plugin',
          icon: dict.Icon,
          desc: appPath,
          type: 'app',
          action: `start "dummyclient" "${appPath}"`,
          keyWords: [dict.DisplayName],
          name: dict.DisplayName,
          names: [dict.DisplayName],
        });
      }
    }
  });
}

export const getApp = {
  init: getWinAppList,
  fileLists,
};
