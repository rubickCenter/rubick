[English](./README.md) | 简体中文


<div align= "center">
<img align="center" width=200 src="https://user-images.githubusercontent.com/21073039/128333805-73e086f0-5523-46a3-a096-cba80b904c46.png" />
</div>


<div align= "center">
 <h1>Rubick</h1>

 <img alt="release" src="https://img.shields.io/github/downloads/rubickCenter/rubick/total" />
 <a href="https://github.com/rubickCenter/rubick/releases">
    <img alt="release" src="https://img.shields.io/github/package-json/v/rubickCenter/rubick" />
 </a>
 <a href="https://github.com/rubickCenter/rubick/actions">
   <img alt=building src=https://img.shields.io/github/workflow/status/rubickCenter/rubick/Build>
 </a>
 <a href="https://github.com/rubickCenter/rubick/blob/master/LICENSE">
    <img alt="npm" src="https://img.shields.io/github/license/rubickCenter/rubick" />
 </a>
 <a href="https://github.com/rubickCenter/rubick/stargazers">
    <img alt="star" src="https://img.shields.io/github/stars/rubickCenter/rubick?style=social">
</a>
<a href="https://gitee.com/monkeyWang/rubick">
    <img alt="码云" src="https://img.shields.io/badge/Gitee--yellow.svg?style=social&logo=data:image/svg+xml;base64,PHN2ZyB0PSIxNTc0ODM3MTM4ODM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NzAiICAgICB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPiAgICA8cGF0aCBkPSJNODkxIDQyOC44SDQ2NS44Yy0yMC40IDAtMzcgMTYuNS0zNyAzN3Y5Mi40YzAgMjAuNCAxNi41IDM3IDM3IDM3aDI1OC45YzIwLjQgMCAzNyAxNi42IDM3IDM3djE4LjRjMCA2MS4zLTQ5LjcgMTEwLjktMTEwLjkgMTEwLjlIMjk5LjRjLTIwLjQgMC0zNy0xNi42LTM3LTM3VjM3My4yYzAtNjEuMyA0OS43LTExMC45IDExMC45LTExMC45aDUxNy42YzIwLjQgMCAzNy0xNi41IDM3LTM3bDAuMS05Mi4zYzAtMjAuNC0xNi41LTM3LTM3LTM3SDM3My4zQzIyMC4yIDk2IDk2IDIyMC4yIDk2IDM3My4zVjg5MWMwIDIwLjQgMTYuNiAzNyAzNyAzN2g1NDUuNEM4MTYuMiA5MjggOTI4IDgxNi4zIDkyOCA2NzguNFY0NjUuOGMwLTIwLjQtMTYuNi0zNy0zNy0zN3oiICAgICAgICAgIGZpbGw9IiNkODFlMDYiIHAtaWQ9IjE3NzEiPjwvcGF0aD48L3N2Zz4="/>
</a>
</div>


基于 electron 的开源工具箱，自由集成丰富插件，打造极致的桌面端效能工具。Rubick(拉比克) 是 dota 里面的英雄之一，其核心技能是插件化使用其他英雄的技能，用完即走。非常符合本工具的设计理念，所以取名 Rubick。

## 安装包
* [Rubick Mac OS](https://github.com/rubickCenter/rubick/releases)
* [Rubick Windows](https://github.com/rubickCenter/rubick/releases)

## 支持能力
- [x] 基于 npm 包模式的插件管理，安装插件和安装 npm 包一样简单
- [x] 支持系统插件，只要在 rubick 运行时，插件可以随时使用
- [x] 支持全局快捷键设置
- [x] 支持剪贴板文件搜索
- [x] 支持搜索本地已安装 app 或 偏好设置
- [x] 支持 MacOS
- [x] 支持 Windows


## 使用文档

[Rubick Docs](https://rubickCenter.github.io/rubick/)


## 目前支持能力
### 1. 搜索系统应用
支持拼音和缩写来搜索系统安装应用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba363e8f60f540e6a5c365c4317c4413~tplv-k3u1fbpfcp-watermark.image)

### 2. UI类插件安装
点击搜索框右侧 `rubick` 图标，进入插件市场，选择所需插件，点击下载按钮即可下载，下载完成后在已安装 tab 下可以找到安装插件。
安装完成后，输入插件呼起命令即可使用对应插件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ae45c7ede1f4e3bb7d35ae845e60b64~tplv-k3u1fbpfcp-watermark.image)

### 3. 系统类插件安装
系统插件安装方式和UI类一样，在插件市场选择`系统分类`，寻找适合自己的系统插件安装即可。

```
系统插件安装成功后，需要重启 rubick 才能生效
```

### 4. 输入框聚焦自动根据剪切板内容匹配插件
在 `rubick` 内搜索`偏好设置`，然后开启`自动粘贴` 功能，即可匹配剪切板内容自动匹配适合插件进行使用。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01ef50fbfa064ba9a88bebe1531eacd4~tplv-k3u1fbpfcp-watermark.image)

### 更多功能
如果您还需要更多功能，欢迎来这里给我们提建议：[issues](https://github.com/rubickCenter/rubick/issues) 。
有价值的想法我们会加入到后期的开发当中。同时也欢迎一起加入共建。

## 赞助
开源不容易，如果该项目对你有用的话，可以打赏我们喝杯 coffee ☕️.

<img width=200 src=https://pic1.zhimg.com/80/v2-688385687a37e962fe32daf136139feb_720w.png />
<img width=200 src=https://pica.zhimg.com/80/v2-1ba296fd2cece45ee1094ee7c259035c_720w.png />

## 贡献
This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)]. <a href="https://github.com/rubickCenter/rubick/graphs/contributors"><img src="https://opencollective.com/rubick/contributors.svg?width=890&button=false" /></a>

## 反馈
对本项目有兴趣或者想要交流学习的同学可以扫码加下面的微信，备注 rubick，帮助我们更好的成长：

![image](https://user-images.githubusercontent.com/21073039/127327603-9796f246-ee4b-4950-a69d-ce3205ec9569.png)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/rubickCenter/rubick/blob/master/LICENSE) file for details.

