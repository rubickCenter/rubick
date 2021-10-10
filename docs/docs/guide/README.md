## 下载 rubick
[rubick 下载安装地址](https://github.com/rubickCenter/rubick/releases)

安装完成后打开 rubick 即可看到主搜索界面：

![](/images/1.png)

目前支持 windows 和 macos。linux 小伙伴正在开发中

## 功能说明
接下来详细介绍 rubick 所包含和支持的功能

### 1. 搜索系统应用
`macos` 下支持搜索当前电脑内所安装的所有 app 和一些偏好设置，目前可搜索路径为：
```json
[
  "/System/Applications",
  "/Applications",
  "/System/Library/PreferencePanes"
]
```
也就是说只要当前系统软件安装到这些目录才会被检索到。支持中文搜索和拼音、拼音首字母搜索：

![](/images/2.gif)

`Windows` 内由于安装目录太多不确定，有的在 C盘，有的在D盘，还有的在自定义其他位置，所以该功能还在设计中，如果您有好的方案也欢迎提供：[issues](https://github.com/rubickCenter/rubick/issues)

### 2. rubick 内置功能

`rubick` 参考了钉钉、微信等 App 的基础功能，也设计内置了 `截图`、`取色`、`锁屏` 基础功能，通过搜索框输入对应关键词呼起。

#### 截屏
输入：`'截屏'` 或者 `'shortCut'` 或者 `'jp'`。

#### 取色
输入：`'取色'` 或者 `'拾色'` 或者 `'Pick color'` 、`'qs'`、`'ss'`。

#### 锁屏
输入：`'锁屏'` 或者 `'lock screen'` 或者 `'sp'`。

### 3. 使用插件
点击搜索框右侧 rubick 图标，进入插件市场，选择所需插件，点击下载按钮即可下载，下载完成后在已安装 tab 下可以找到安装插件。
安装完成后，输入插件呼起命令即可使用对应插件：

![](/images/3.gif)

### 4. 右击增强
通常我们需要使用鼠标右击来对桌面属性进行拓展，`Rubick` 支持对右击属性进行增强功能，长按鼠标右键即可呼起。如果安装的插件支持
特殊类型的文件操作，还可以在右键中唤起插件：

![](/images/4.gif)

### 更多功能
如果您还需要更多功能，欢迎来这里给我们提建议：[issues](https://github.com/clouDr-f2e/rubick/issues/20) 
有价值的想法我们会加入到后期的开发当中。同时也欢迎一起加入共建。

### 联系我们

扫码关注 Rubick 官微, 与我们保持联系：

![wechat](https://z3.ax1x.com/2021/09/26/4yRpN9.jpg)