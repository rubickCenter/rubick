const { BrowserWindow, protocol } = require("electron");
module.exports = () => {
  let win;

  let init = (opts) => {
    createWindow(opts);
  };

  let createWindow = (opts) => {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`

    win = new BrowserWindow({
      height: 60,
      useContentSize: true,
      width: 800,
      frame: false,
      title: '拉比克',
      show: false,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true // 在网页中集成Node
      }
    })

    win.loadURL(winURL)

    protocol.interceptFileProtocol('image', (req, callback) => {
      const url = req.url.substr(8);
      callback(decodeURI(url));
    }, (error) => {
      if (error) {
        console.error('Failed to register protocol');
      }
    });

    win.once('ready-to-show', () => win.show());
    win.on("closed", () => {
      win = undefined;
    });
  };

  let getWindow = () => win;

  return {
    init: init,
    getWindow: getWindow,
  };
};
