import path from 'path';
import fs from 'fs';

export default (): string => {
  let localDataFile: any = process.env.HOME;
  if (!localDataFile) {
    localDataFile = process.env.LOCALAPPDATA;
  }
  const rubickPath = path.join(localDataFile, 'rubick');
  if (!fs.existsSync(rubickPath)) {
    fs.mkdirSync(rubickPath);
  }
  return rubickPath;
};
