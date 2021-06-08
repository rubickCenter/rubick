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
  filePath = location.href.replace('file://', '');
}
const {ipcRenderer, nativeImage, clipboard, remote} = require('electron');

const currentWindow = remote.getCurrentWindow();
const winId = currentWindow.id;

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
    ipcRenderer.once('onPluginEnter', (e, message) => {
      const feature = JSON.parse(message.detail)
      console.log(feature)
      cb({...feature, type: 'text'})
    })
  },
  onPluginReady(cb) {
    ipcRenderer.once('onPluginReady', (e, message) => {
      const feature = JSON.parse(message.detail)
      cb({...feature, type: 'text'})
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
      ipcRenderer.once(`msg-back-getPath`, (e, result) => {
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
    goto(md, title) {
      ipcRenderer.send('msg-trigger', {
        type: 'ubrowser.goto',
        md, title,
      });
      return utools.ubrowser;
    },
    run() {

    }
  }
}
require(path.join(filePath, '../preload.js'));
window.exports && ipcRenderer.sendToHost('templateConfig', {config: window.exports});

