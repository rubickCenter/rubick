import fs from "fs";

export const getlocalDataFile = () => {
  let localDataFile = process.env.HOME;
  if (!localDataFile) {
    localDataFile = process.env.LOCALAPPDATA;
  }
  return localDataFile;
};

export function saveData(path, value) {
  fs.writeFileSync(path, JSON.stringify(value));
}

export function getData(path, defaultValue) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return defaultValue || undefined;
  }
}
