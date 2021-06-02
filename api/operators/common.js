const { shell } = require('electron');

module.exports = {
  openInBrowser(url) {
    shell.openExternal(url);
  }
}
