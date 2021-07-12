const fs = require("fs");

const getlocalDataFile = () => {
  let localDataFile = process.env.HOME;
  if (!localDataFile) {
    localDataFile = process.env.LOCALAPPDATA;
  }
  return localDataFile;
};

function saveData(path, value) {
  fs.writeFileSync(path, JSON.stringify(value));
}

function getData(path, defaultValue) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return defaultValue || undefined;
  }
}

module.exports = {
  getlocalDataFile,
  saveData,
  getData
}
