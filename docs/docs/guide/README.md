## 前言
rubick 之前的插件管理，依托于云服务器存储，我们需要为服务器存储支付一笔不小的开销。
由于项目完全开源，所以几乎无任何收入，所以为了让 rubick 先生存下去，我们再三抉择把插件包管理方式托管到了`npm` 上。

由于 rubick 的插件管理体系是基于 npm 的包管理体系，所以当您需要使用插件的时候，需要手动保证当前电脑已经安装好了`node`环境。
如果当前电脑已经安装过 `node`，那么您可以直接下载 `rubick` 进行使用啦！

[macos 下安装 nodejs 方法](https://juejin.cn/post/6844903886541553672)

[windows 下安装 nodejs 方法](https://juejin.cn/post/6892790243687137287)

## 下载 rubick
[rubick 下载安装地址](https://github.com/rubickCenter/rubick/releases)

macos 选择 `pkg` 文件，windows 选择 `exe` 文件。
安装完成后打开 rubick 即可看到主搜索界面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26f0fbe2c69246b6a3ed139b0df1ca0b~tplv-k3u1fbpfcp-watermark.image)

目前支持 windows 和 macos。linux 小伙伴正在开发中

## 功能说明
接下来详细介绍 rubick 所包含和支持的功能

### 1. 搜索系统应用
支持拼音和缩写来搜索系统安装应用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba363e8f60f540e6a5c365c4317c4413~tplv-k3u1fbpfcp-watermark.image)

### 2. UI类插件安装
点击搜索框右侧 `rubick` 图标，进入插件市场，选择所需插件，点击下载按钮即可下载，下载完成后在已安装 tab 下可以找到安装插件。
安装完成后，输入插件呼起命令即可使用对应插件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ae45c7ede1f4e3bb7d35ae845e60b64~tplv-k3u1fbpfcp-watermark.image)

### 3. 系统类插件安装
系统插件安装方式和UI类一样，在插件市场选择`系统分类`，寻找适合自己的系统插件安装即可。
::: danger
系统插件安装成功后，需要重启 `rubick` 才能生效
:::

### 4. 输入框聚焦自动根据剪切板内容匹配插件
在 `rubick` 内搜索`偏好设置`，然后开启`自动粘贴` 功能，即可匹配剪切板内容自动匹配适合插件进行使用。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01ef50fbfa064ba9a88bebe1531eacd4~tplv-k3u1fbpfcp-watermark.image)

### 更多功能
如果您还需要更多功能，欢迎来这里给我们提建议：[issues](https://github.com/rubickCenter/rubick/issues) 。
有价值的想法我们会加入到后期的开发当中。同时也欢迎一起加入共建。
