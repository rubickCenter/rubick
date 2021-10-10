## windows 本地启动项目
如果您是在 `windows` 系统下使用本项目进行启动的话，如果出现了一些跑不起的情况，下面的一些经验或许可以帮助您。

### 安装依赖
项目是基于 `electron-vue` 的，所以需要本地已经安装好 `nodejs`。当 `clone` 好项目到本地的时候，需要对项目依赖
进行手动安装：
```bash
$ cd rubick
$ npm install
```
由于本项目依赖 [iohook](https://wilix-team.github.io/iohook/) 和 [robotjs](http://robotjs.io/)
而这2个项目在安装时，依赖 node gyp 的编译，所以你可能会遇到一些环境问题或者网络问题。
### iohook 安装
首先，我们先来安装 `iohook`，按照 `iohook` 的文档所示，安装前需要先确定当前 `electron` 的版本以及 `abi` 的版本，
现在我们使用的 `electron` 版本是 `v11.0.2` 所以只需要在 `package,json` 中加上以下配置，指定安装特点的`.node` 文件

```json
{
  "iohook": {
    "targets": [
      "node-83",
      "electron-85"
    ],
    "platforms": [
      "win32"
    ],
    "arches": [
      "x64",
      "ia32"
    ]
  }
}
```
接下来执行安装操作：
```shell
$ npm i iohook
```

如果此时一直停留在 `node install` 进度上，说明可能需要翻墙，这里就不介绍如何翻墙了。此时虽然 `.node` 文件没有下载成功，但是 `iohook` 源文件
已经安装成功，如果因为翻墙问题导致的安装失败，我们解决好翻墙问题后，可以接着运行一下：

```shell
$ npm run rebuild_win
```
到这里 `iohook` 应该就安装好了

### 安装 robotjs
和 iohook 不同， `robotjs` 需要 `node gyp` 重新编译 `C++`。所以第一步是先安装源文件：
```shell
npm i robotjs@git+https://github.com/Toinane/robotjs.git
```
此时如果报错，大多还是因为墙的问题。不管包不报错，我们接下来都需要执行一下下面的编译操作：

```shell
npm run rebuild_win
```
此时，可能会出现下这个错：

```text
gyp ERR! find VS msvs_version not set from command line or npm config
// ...
```
google 了一圈，大多数是说缺少 `visual studio`。需要安装，所以可以执行这个命令：

```shell
$ npm install --global --production windows-build-tools 
```
到这里会进入正常的安装流程，理论上会一部到底，如果你卡在了 `Successfully installed Python 2.7` 不动了
可以去一下 `C:\Users\you username\.windows-build-tools` 找一下看看应该会有一个 `vs_BuildTools` 文件
双击后，会出现以下弹窗：

![](/images/6.png)

点击启动，如果一切正常那么可以方向关掉你的命令行了，此时 vs 已经安装成功，接下来要配置一下编译工具：
```shell
$ npm config set python python3.9
$ npm config set msvs_version 2017
```
到这里终于完事了，再执行一下 `npm run rebuild_win` 此时已经安装成功！

## macos
macos 下安装就简单不少了，首先先解决翻墙的问题，然后：
```shell
$ npm i
```

最后执行

```shell
$npm run rebuild
```

## 最后
如果您在启动过程中还有其他的问题，欢迎随时给我们反馈，我们会在第一时间回复：[issues](https://github.com/rubickCenter/rubick/issues/20) 




