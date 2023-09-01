export default {
  linux(): boolean {
    return process.platform === 'linux';
  },
  macOS(): boolean {
    return process.platform === 'darwin';
  },
  windows(): boolean {
    return process.platform === 'win32';
  },
  production(): boolean {
    return process.env.NODE_ENV !== 'development';
  },
  dev(): boolean {
    return process.env.NODE_ENV === 'development';
  },
};
