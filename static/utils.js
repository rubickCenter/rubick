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

const isArray = Array.isArray ||
  function(object){ return object instanceof Array }

function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype
}

function isObject(obj) { return typeof obj == "object" }


function extend(target, source, deep) {
  for (let key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {}
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = []
      extend(target[key], source[key], deep)
    }
    else if (source[key] !== undefined) target[key] = source[key]
}

module.exports = {
  getlocalDataFile,
  saveData,
  getData,
  extend
}
