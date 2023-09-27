import path from 'path';
import fs from 'fs-extra';
import os from 'os';

const getSearchFiles = (argv = process.argv, cwd = process.cwd()) => {
  const files = argv.slice(2); // 过滤['rubick.exe', 'search']这两个参数，直接获取需要上传的图片路径
  let result: any = [];
  if (files.length > 0) {
    // 如果图片列表不为空
    result = files
      .map((item) => {
        if (path.isAbsolute(item)) {
          // 如果是绝对路径
          return {
            path: item,
          };
        } else {
          const tempPath = path.join(cwd, item); // 如果是相对路径，就拼接
          if (fs.existsSync(tempPath)) {
            // 判断文件是否存在
            return {
              path: tempPath,
            };
          } else {
            return null;
          }
        }
      })
      .filter((item) => item !== null); // 排除为null的路径
  }
  return result; // 返回结果
};

const putFileToRubick = (webContents, files) => {
  webContents.executeJavaScript(
    `window.searchFocus(${JSON.stringify(files)}, false)`
  );
};

const copyFileOutsideOfElectronAsar = function (
  sourceInAsarArchive,
  destOutsideAsarArchive
) {
  if (fs.existsSync(sourceInAsarArchive)) {
    // file will be copied
    if (fs.statSync(sourceInAsarArchive).isFile()) {
      const file = destOutsideAsarArchive;
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(file, fs.readFileSync(sourceInAsarArchive));
    }

    // dir is browsed
    else if (fs.statSync(sourceInAsarArchive).isDirectory()) {
      fs.readdirSync(sourceInAsarArchive).forEach(function (fileOrFolderName) {
        copyFileOutsideOfElectronAsar(
          sourceInAsarArchive + '/' + fileOrFolderName,
          destOutsideAsarArchive + '/' + fileOrFolderName
        );
      });
    }
  }
};

const macBeforeOpen = () => {
  const dest = `${os.homedir}/Library/Services/rubick.workflow`;
  if (fs.existsSync(dest)) {
    // 判断是否存在
    return true;
  } else {
    // 如果不存在就复制过去
    try {
      copyFileOutsideOfElectronAsar(
        path.join(__static, 'rubick.workflow'),
        dest
      );
    } catch (e) {
      console.log(e);
    }
  }
};

export { getSearchFiles, putFileToRubick, macBeforeOpen };
