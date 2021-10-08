import fs from "fs";

export const getLocalDataFile = () => {
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
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (e) {
    return defaultValue || undefined;
  }
}

export function throttle(func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  let later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    let now = Date.now();
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export const commonConst = {
  linux: function() {
    return process.platform === "linux";
  },
  macOS() {
    return process.platform === "darwin";
  },
  windows() {
    return process.platform === "win32";
  },
  production: function() {
    return process.env.NODE_ENV !== "development";
  },
  dev: function() {
    return process.env.NODE_ENV === "development";
  },
};
