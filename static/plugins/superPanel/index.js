const {ipcRenderer, nativeImage, remote, clipboard} = require('electron')
const md5 = require("md5");
const rp = require("request-promise");
const isChinese = require('is-chinese');
const path = require('path');
const fs = require('fs');
const { spawn } = require ('child_process');
const mineType = require("mime-types");

const opConfig = remote.getGlobal('opConfig');

new Vue({
  el: '#app',
  data: {
    code: '',
    current: {},
    selectData: {
      translate: {},
      optionPlugin: [],
    },
    options: {
      translate: [],
      common: [
        {
          type: 'default',
          name: '终端中打开',
          icon: './assets/terminal.png',
          click: (fileUrl) => {
            spawn('open', [ '-a', 'Terminal', fileUrl ]);
          }
        },
        {
          type: 'default',
          name: '新建文件',
          icon: './assets/new.png',
          click: (fileUrl) => {
            remote.dialog.showSaveDialog({
              title: "请选择要保存的文件名",
              buttonLabel: "保存",
              defaultPath: fileUrl.replace('file://', ''),
              showsTagField: false,
              nameFieldLabel: '',
            }).then(result => {
              fs.writeFileSync(result.filePath, '');
            });
          }
        },
        {
          type: 'default',
          name: '复制当前路径',
          icon: './assets/link.png',
          click: (fileUrl) => {
            clipboard.writeText(fileUrl.replace('file://', ''))
          }
        }
      ],
      selected: [
        {
          type: 'default',
          name: '复制当前路径',
          icon: './assets/link.png',
          click: (fileUrl) => {
            clipboard.writeText(fileUrl.replace('file://', ''))
          }
        }
      ]
    },
    targetOptions: [],
  },
  created() {
    // 简单唤起超级面板
    ipcRenderer.on('trigger-super-panel', (e, args) => {
      this.selectData = args;
      const ext = path.extname(this.selectData.fileUrl);
      // 剪切板只有文本时，显示翻译
      if (!this.selectData.fileUrl) {
        const word = this.selectData.text;
        const isCh = isChinese(word);
        this.translate(word, isCh ? 'en' : 'zh');
        this.targetOptions = JSON.parse(JSON.stringify(this.options.translate));
        (this.selectData.optionPlugin || []).forEach(plugin => {
          plugin.features.forEach(fe => {
            fe.cmds.forEach(cmd => {
              if (cmd.type === 'regex' && eval(cmd.match).test(word)) {
                this.targetOptions.push({
                  type: 'ext',
                  name: cmd.label,
                  icon: plugin.icon,
                  click: () => {
                    ipcRenderer.send('superPanel-openPlugin', {
                      cmd: cmd,
                      plugin: plugin,
                      feature: fe,
                      data: word
                    })
                  }
                });
              }
            })
          });
        });
      } else if (!ext || path.parse(this.selectData.fileUrl).base === 'Desktop') {
        // 如果在桌面上或者没有选择任何文件，则展示通用选项
        this.targetOptions = this.options.common;
      } else {
        // 有文件选择
        this.targetOptions = JSON.parse(JSON.stringify(this.options.selected));
        // 检测上传
        (this.selectData.optionPlugin || []).forEach(plugin => {
          plugin.features.forEach(fe => {
            fe.cmds.forEach(cmd => {
              // 如果是图片，则唤起图片选项
              const regImg = /\.(png|jpg|gif|jpeg|webp)$/;
              if (cmd.type === 'img' && regImg.test(ext)) {
                this.targetOptions.push({
                  type: 'ext',
                  name: cmd.label,
                  icon: plugin.icon,
                  click: (fileUrl) => {
                    const base64 = this.fileToBase64(fileUrl);
                    ipcRenderer.send('superPanel-openPlugin', {
                      cmd: cmd,
                      plugin: plugin,
                      feature: fe,
                      data: base64,
                    });
                  }
                })
              }
              // 如果是文件，且符合文件正则类型
              if (cmd.type === 'file' && new RegExp(cmd.match).test(ext)) {
                this.targetOptions.push({
                  type: 'ext',
                  name: cmd.label,
                  icon: '',
                  click: () => {
                    ipcRenderer.send('superPanel-openPlugin', {
                      cmd: cmd,
                      plugin: plugin,
                      feature: fe,
                      data: {
                        isFile: true,
                        isDirectory: false,
                        name: path.basename(this.selectData.fileUrl),
                        path: this.selectData.fileUrl
                      }
                    })
                  }
                })
              }
            })
          });
        });
      }
    });

  },

  methods: {
    translate(msg, to) {
      const {appid, key} = opConfig.get().superPanel.baiduAPI;
      if (!appid || !key) return;
      const q = msg;
      const salt = parseInt(Math.random() * 1000000000); //加盐
      const sign = md5(appid + q + salt + key); //生成签名
      const params = encodeURI(
        `q=${q}&from=auto&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`
      );
      const options = {
        uri: `https://fanyi-api.baidu.com/api/trans/vip/translate?${params}`,
      };
      return rp(options).then((res) => {
        this.$set(this.selectData, 'translate', JSON.parse(res).trans_result)
      })
    },
    commonClick(item, fileUrl) {
      ipcRenderer.send('superPanel-hidden')
      item.click(fileUrl);
    },

    fileToBase64 (filePath) {
      let data = fs.readFileSync(filePath.replace('file://', ''));
      data = new Buffer(data).toString("base64");
      let base64 = "data:" + mineType.lookup(filePath) + ";base64," + data;
      return base64;
    },

    openMainWindow() {
      ipcRenderer.send('msg-trigger', {
        type: 'showMainWindow',
      });
    }
  },

  watch: {
    selectData: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          ipcRenderer.send('superPanel-setSize', parseInt(getComputedStyle(document.getElementById('app')).height))
        })
      }
    }
  }
})
