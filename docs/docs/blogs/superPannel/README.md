## 前言
超级面板用于增强用户右击能力，实现快速呼起插件的能力，本次实现方式是通过 `robotjs` 以及 `iohook` 一起来完成

### 功能截图：

#### 文件夹下长按右建
<img src=https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b3d6ea7a25b4b908acc471471628979~tplv-k3u1fbpfcp-watermark.image width=300 />

#### 选择文件后长按右键
<img src=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e220166cb464328b432f42d14ba9ab2~tplv-k3u1fbpfcp-watermark.image width=300 />

#### 选择文字后长按右键
<img src=https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f909d08a8441e8a506831796908ef9~tplv-k3u1fbpfcp-watermark.image width=300 />

## 实现原理

### 获取选中文案
要实现改功能核心是要读取当前用户选中的文案或者文件，根据当前选择内容进行不同功能展示。但是核心有一个问题是如何来实现获取当前选中的内容。这个问题思考了很久很久，要想获取选中的文案，感觉唯一的办法是使用 `ctrl + c` 或者 `command + c` 来先复制到剪切板，再通过 `electron clipboard` 来获取当前剪切板内容。但是 `utools` 可不是通过先复制再长按这样的操作来实现的，而是直接选中文本或者文件长按后呼起超级面板。**所以一定要在右击长按前获取到当前选中的内容。**

如果要这么干，可能真的无解了，之前就因为这么想，才被无解了。正确的思路应该是先长按再获取选中的内容。别看只是掉了个个，但实现确实天壤之别：

1. 先获取选中内容：这就要求我们必须监听原生系统选中事件，但是 `electron` 并没有提供能力，我们也无法监听系统选择事件。
2. 先右击，后获取内容，这样的好处在于先右击可以通过监听鼠标右击事件，相比选择事件更加容易。

所以思路就有了，先监听长按右击事件：

```js
// macos
const mouseEvents = require("osx-mouse");

const mouseTrack = mouseEvents();
// 按下去的 time
let down_time = 0;

// 是否弹起
let isPress = false;

// 监听右击
mouseTrack.on('right-down', () => {
    isPress = true;
    down_time = Date.now();
    // 长按 500ms 后触发
    setTimeout(async () => {
      if (isPress) {
        // 获取选中内容
        const copyResult = await getSelectedText();
    }, 500);
})
mouseTrack.on('right-up', () => {
    isPress = false;
});

```

接下来一步就是要去实现获取选中内容，要获取选中内容有个比较骚的操作，就是：

1. 通过 `clipboard` 先获取当前剪切板内容，并存下 A
2. 通过 `robot.js` 来调用系统 `command + c` 或者 `ctrl + c`
3. 再通过 `clipboard` 先获取当前剪切板内容，并存下 B
4. 再将 A 写到剪切板中，返回 B

先存剪切板内容的目的在于我们是偷偷帮用户执行了复制动作，当读取完用户选择内容后，需要回复用户之前的剪切板内容。接下来看一下简单的实现：

```js
const getSelected = () => {
  return new Promise((resolve) => {
    // 缓存之前的文案
    const lastText = clipboard.readText('clipboard');

    const platform = process.platform;
    
    // 执行复制动作
    if (platform === 'darwin') {
      robot.keyTap('c', 'command');
    } else {
      robot.keyTap('c', 'control');
    }

    setTimeout(() => {
      // 读取剪切板内容
      const text = clipboard.readText('clipboard') || ''
      const fileUrl = clipboard.read('public.file-url');
      
      // 恢复剪切板内容
      clipboard.writeText(lastText);

      resolve({
        text,
        fileUrl
      })
    }, 300);
  })
}
```
### 通知超级面板窗口当前选中内容
当获取到了选中内容后，接下来就是需要创建超级面板的 `BrowserWindow`:
```js
const { BrowserWindow, ipcMain, app } = require("electron");

module.exports = () => {
  let win;

  let init = (mainWindow) => {
    if (win === null || win === undefined) {
      createWindow();
    }
  };

  let createWindow = () => {
    win = new BrowserWindow({
      frame: false,
      autoHideMenuBar: true,
      width: 250,
      height: 50,
      show: false,
      alwaysOnTop: true,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        nodeIntegration: true,
        devTools: false,
      },
    });
    win.loadURL(`file://${__static}/plugins/superPanel/index.html`);
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
```
然后再通知 `superPanel` 进行内容展示：
```js
 win.webContents.send('trigger-super-panel', {
  ...copyResult,
  optionPlugin: optionPlugin.plugins,
});
```

### 超级面板点击操作
接下来要实现超级面板点击操作，这块也是比较简单的了，直接上代码好了：
#### 1. 打开 Terminal

```js
const { spawn } = require ('child_process');

spawn('open', [ '-a', 'Terminal', fileUrl ]);
```

#### 2. 新建文件

```js
remote.dialog.showSaveDialog({
  title: "请选择要保存的文件名",
  buttonLabel: "保存",
  defaultPath: fileUrl.replace('file://', ''),
  showsTagField: false,
  nameFieldLabel: '',
}).then(result => {
  fs.writeFileSync(result.filePath, '');
});
```

#### 3. 复制路径
```js
clipboard.writeText(fileUrl.replace('file://', ''))
```
