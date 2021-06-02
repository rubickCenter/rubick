const {ipcRenderer} = require("electron");
const AnyProxy = require('anyproxy');

const options = {
  port: 8001,
  webInterface: {
    enable: true,
    webPort: 8002
  },
  forceProxyHttps: false,
  wsIntercept: false, // 不开启websocket代理
  silent: true
};

class Network {
  constructor() {
    this.mockList = [];
    this.proxyServer = null;
  }
  initNetwork(op, {
    beforeSendRequest,
    beforeSendResponse,
    success,
  }) {
    if (op === 'start') {
      if (!this.proxyServer || !this.proxyServer.recorder) {
        const _this = this;
        options.rule = {
          *beforeSendRequest(requestDetail) {
            if (beforeSendRequest) {
              return beforeSendRequest(requestDetail);
            }
            return requestDetail
          },
          *beforeSendResponse (requestDetail, responseDetail) {
            if (beforeSendResponse) {
              return beforeSendResponse(requestDetail, responseDetail);
            }
            return responseDetail;
          }
        };
        this.proxyServer = new AnyProxy.ProxyServer(options);
        this.proxyServer.once('ready', () => {
          console.log('启动完成');
          success && success(this.proxyServer);
        });
      }
      this.proxyServer.start();
    } else {
      AnyProxy.utils.systemProxyMgr.disableGlobalProxy('http');
      AnyProxy.utils.systemProxyMgr.disableGlobalProxy('https');
      this.proxyServer.close();
      success && success();
    }
  }
  getIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
}

module.exports = new Network();

