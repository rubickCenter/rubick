const APP_FINDER_PATH = process.platform === 'darwin' ? ['/System/Applications', '/Applications', '/System/Library/PreferencePanes'] : []

export {
  APP_FINDER_PATH
}
