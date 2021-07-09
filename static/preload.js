const marked = require("marked");
const rendererMD = new marked.Renderer();
const path = require('path');

let filePath = '';
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

if (location.href.indexOf('targetFile') > -1) {
  filePath = decodeURIComponent(getQueryVariable('targetFile'));
} else {
  filePath = location.pathname.replace('file://', '');
}
const {ipcRenderer, nativeImage, clipboard, remote, shell} = require('electron');

const currentWindow = remote.getCurrentWindow();
const winId = currentWindow.id;
const BrowserWindow = remote.BrowserWindow;

function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

window.utools = window.rubick = {
  // 事件
  onPluginEnter(cb) {
    ipcRenderer.on('onPluginEnter', (e, message) => {
      const feature = message.detail;
      cb({...feature, type: message.cmd.type ? message.cmd.type : 'text', payload: message.payload})
    })
  },
  onPluginReady(cb) {
    ipcRenderer.once('onPluginReady', (e, message) => {
      const feature = message.detail
      cb({...feature, type: message.cmd.type ? message.cmd.type : 'text', payload: message.payload})
    })
  },
  onPluginOut(cb) {
    ipcRenderer.once('onPluginOut', (e, message) => {
      const feature = JSON.parse(message.detail)
      cb({...feature, type: 'text'})
    })
  },

  // 窗口交互
  hideMainWindow() {
    ipcRenderer.send('msg-trigger', {
      type: 'hideMainWindow',
    });
  },
  showMainWindow() {
    ipcRenderer.send('msg-trigger', {
      type: 'showMainWindow',
    });
  },
  setExpendHeight(height) {
    ipcRenderer.send('msg-trigger', {
      type: 'setExpendHeight',
      height,
      winId
    });
  },
  setSubInput(onChange, placeHolder, isFocus) {
    ipcRenderer.sendToHost('setSubInput', {
      placeHolder, isFocus
    });
    ipcRenderer.on(`msg-back-setSubInput`, (e, result) => {
      onChange({text: result});
    });
  },

  removeSubInput() {
    ipcRenderer.sendToHost('removeSubInput');
  },

  setSubInputValue(text) {
    ipcRenderer.sendToHost('setSubInputValue', {
      text
    });
  },

  getPath(name) {
    ipcRenderer.send('msg-trigger', {
      type: 'getPath',
      name,
    });
    return new Promise((resolve, reject) => {
      ipcRenderer.on(`msg-back-getPath`, (e, result) => {
        console.log(result)
        result ? resolve(result) : reject();
      });
    })
  },

  showNotification(body, clickFeatureCode) {
    const myNotification = new Notification('Rubick 通知', {
      body
    });
    return myNotification;
    // todo 实现 clickFeatureCode
  },
  showOpenDialog(options) {
    ipcRenderer.send('msg-trigger', {
      type: 'showOpenDialog',
      options: {...options},
    });
    return new Promise((resolve, reject) => {
      ipcRenderer.once(`msg-back-showOpenDialog`, (e, result) => {
        result ? resolve(result) : reject();
      });
    })
  },

  copyImage(img) {
    convertImgToBase64(img,function(base64Image) {
      const image = nativeImage.createFromDataURL(base64Image)
      clipboard.writeImage(image)
    })
  },
  copyText(text) {
    clipboard.writeText(text);
  },
  db: {
    put(data) {
      ipcRenderer.send('msg-trigger', {
        type: 'db.put',
        data,
      });
      return new Promise((resolve, reject) => {
        ipcRenderer.once(`msg-back-db.put`, (e, result) => {
          result ? resolve(result) : reject();
        });
      })
    },
    get(key) {
      ipcRenderer.send('msg-trigger', {
        type: 'db.get',
        key,
      });
      return new Promise((resolve, reject) => {
        ipcRenderer.once(`msg-back-db.get`, (e, result) => {
          result ? resolve(result) : reject();
        });
      })
    },
    remove(key) {
      ipcRenderer.send('msg-trigger', {
        type: 'db.remove',
        key,
      });
      return new Promise((resolve, reject) => {
        ipcRenderer.once(`msg-back-db.remove`, (e, result) => {
          result ? resolve(result) : reject();
        });
      })
    },
    allDocs(key) {
      ipcRenderer.send('msg-trigger', {
        type: 'db.allDocs',
        key,
      });
      return new Promise((resolve, reject) => {
        ipcRenderer.once(`msg-back-db.allDocs`, (e, result) => {
          console.log(result);
          result ? resolve(result) : reject();
        });
      })
    },
    bulkDocs(docs) {
      ipcRenderer.send('msg-trigger', {
        type: 'db.bulkDocs',
        key,
      });
      return new Promise((resolve, reject) => {
        ipcRenderer.once(`msg-back-db.bulkDocs`, (e, result) => {
          result ? resolve(result) : reject();
        });
      })
    }
  },
  isDarkColors() {
    return false;
  },
  getFeatures() {
    ipcRenderer.sendToHost('getFeatures');
    return new Promise(resolve => {
      ipcRenderer.on(`msg-back-getFeatures`, (e, result) => {
        resolve(result);
      });
    });
  },
  setFeature(feature) {
    ipcRenderer.sendToHost('setFeature', {feature});
  },
  ubrowser: {
    winId: '',
    async goto(md, opts) {
      const objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
      let winId;
      let win;
      win = new BrowserWindow({
        show: false,
        title: typeof opts === 'object' ? '' : opts,
        webPreferences: {
          webSecurity: false,
          enableRemoteModule: true,
          backgroundThrottling: false,
          webviewTag: true,
          nodeIntegration: true // 在网页中集成Node
        }
      });
      if(objExp.test(md) && md.indexOf('http') === 0) {
        await win.loadURL(md);
        winId = win.id;
      } else {
        marked.setOptions({
          renderer: rendererMD,
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        });
        const htmlContent = marked(md);
        win.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent))
        win.once('ready-to-show', () => win.show());
        winId = win.id;
      }
      return {
        value(selector, value) {
          ipcRenderer.send('msg-trigger', {
            type: 'ubrowser.value',
            winId,
            selector, value
          });
          return new Promise(resolve => {
            ipcRenderer.once(`msg-back-ubrowser.value`, (e, result) => {
              resolve(this)
            });
          })
        },
        click(selector) {
          ipcRenderer.send('msg-trigger', {
            type: 'ubrowser.click',
            winId,
            selector,
          });
          return new Promise(resolve => {
            ipcRenderer.once(`msg-back-ubrowser.click`, (e, result) => {
              resolve(this)
            });
          })
        },
        run(options) {
          ipcRenderer.send('msg-trigger', {
            type: 'ubrowser.run',
            winId,
            ...options
          });
        }
      }
    },
  },
  shellOpenExternal(url) {
    shell.openExternal(url);
  }
}
const preloadPath = getQueryVariable('preloadPath') || './preload.js';

require(path.join(filePath, '../', preloadPath));
window.exports && ipcRenderer.sendToHost('templateConfig', {config: JSON.parse(JSON.stringify(window.exports))});
window.ipcRenderer = ipcRenderer;
