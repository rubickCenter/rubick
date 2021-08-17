## 插件化原理
浏览器是打开不同网页进行浏览就是一个天然的插件，我们在做 `hybird` 混合开发的时候，App 内的 H5 页面也是可以类比成一个个
插件。微信小程序在微信环境内运行也可以看做一个插件。他们都有一个共性：**在宿主环境内运行插件页面，需要使用宿主能力时
调用宿主提供的API来完成自身能力的增强**。

所以 electron 也可以看做一个移动端 APP，我们通过 `webview` 来加载 `H5` 页面，`H5` 页面调用 `electron App` 内置 API
完成功能增强。所以这就是我们核心的原理思想。

## electron webview 方式
### 1. electron 中使用 webview

```html
<webview src="https://xxx.xx.com/index.html" preload="preload.js" />
```

### 2. 实现 `bridge`
```js
// preload.js
window.rubickBridge = {
  sayHello() {
    console.log('hello world')
  }
}
```

### 3. 插件借助 `bridge` 调用 `electron` 的能力

```html
<html>
 <body>
     <div>这是一个插件<div>
 </body>
 <script>
  window.rubickBridge.sayHello()
</script>
</html>
```

### 4. 通信
因为 `proload.js` 是 `electron` 的 `renderer` 进程的，所以如果需要使用部分 `main` 进程的能力，则需要使用通信机制：
```js
// main process
ipcMain.on('msg-trigger', async (event, arg) => {
    const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow
    const operators = arg.type.split('.');
    let fn = Api;
    operators.forEach((op) => {
      fn = fn[op];
    });
    const data = await fn(arg, window);
    event.sender.send(`msg-back-${arg.type}`, data);
});
  
// renderer process
ipcRenderer.send('msg-trigger', {
  type: 'getPath',
  name,
});
ipcRenderer.on(`msg-back-getPath`, (e, result) => {
  console.log(result)
});
```

## 插件加载原理
### rubick 使用插件
首先我们需要实现一个插件，必须要有个 `plugin.json`，这玩意就是用来告诉 `rubick` 插件的信息。
```json
{
    "pluginName": "helloWorld",
    "description": "我的第一个uTools插件",
    "main": "index.html",
    "version": "0.0.1",
    "logo": "logo.png",
    "features": [
        {
          "code": "hello",
          "explain": "hello world",
          "cmds":["hello", "你好"]
        }
    ]
}
```
接下来是将写好的插件用 `rubick` 跑起来，复制 `plugin.json` 到 `rubick` 搜索框即可，所以当 `rubick` 检测到输入框内执行
`ctrl/command + c` 时，读取剪切板内容，如果剪切板复制的是文件类型的 `plugin.json`，那么就将构造插件的 `pluginConfig` 配置文件，用于后续搜索
时使用。

```js
// 监听 input change
// 读取剪切板内容
const fileUrl = clipboard.read('public.file-url').replace('file://', '');
// 复制文件
if (fileUrl && value === 'plugin.json') {
  // 读取 plugin.json 配置
  const config = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));
  const pluginConfig = {
    ...config,
    // index.html 文件位置，用于webview加载
    sourceFile: path.join(fileUrl, `../${config.main || 'index.html'}`),
    id: uuidv4(),
    type: 'dev',
    icon: 'image://' + path.join(fileUrl, `../${config.logo}`),
    subType: (() => {
      if (config.main) {
        return ''
      }
      return 'template';
    })()
  };
}
```
实现效果如下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b40162dd4c774a3ca6db2aa63c3606eb~tplv-k3u1fbpfcp-watermark.image)

### rubick 内搜索插件原理

接下来就是进行命令搜索插件:


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/236e9308fa324a3bac266ff7332cd1ab~tplv-k3u1fbpfcp-watermark.image)

实现这个功能其实也就是对之前存储的`pluginConfig`的里面的 `features` 进行遍历，找到相应的 `cmd` 后进行下拉框展示即可。

```js
state.devPlugins.forEach((plugin) => {
  // dev 插件未开启
  if (plugin.type === 'dev' && !plugin.status) return;
  const feature = plugin.features;
  feature.forEach((fe) => {
    // fe.cmds: 所有插件的命令; value: 当前输入框内搜索的名称
    const cmds = searchKeyValues(fe.cmds, value);
    options = [
      ...options,
      ...cmds.map((cmd) => ({
        name: cmd, 
        value: 'plugin',
        icon: plugin.sourceFile ? 'image://' + path.join(plugin.sourceFile, `../${plugin.logo}`) : plugin.logo,
        desc: fe.explain,
        type: plugin.type,
        click: (router) => {
          // 跳转到指定插件页面
          actions.openPlugin({ commit }, { cmd, plugin, feature: fe, router });
        }
        }))
      ];
    });
});
```

当点击 input 内插件时，需要跳转到插件 `webview` 加载页面：

```js
// actions.openPlugin
router.push({
  path: '/plugin',
  query: {
    ...plugin,
    _modify: Date.now(),
    detail: JSON.stringify(feature)
  }
});
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37cf1909b1374606bdd1fbae657433c7~tplv-k3u1fbpfcp-watermark.image)

本页写的插件demo已上传 [github](https://github.com/clouDr-f2e/rubick-plugin-demo)
