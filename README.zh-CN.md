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

## 赞助和服务
我们通过有偿的方式积累高质量的常见问题、最佳实践文档，加入星球后可以和作者进行互动和答疑。我们提供技术支持、答疑解惑、定制化插件开发、二次定制化开发 rubick 等等官方服务。

权益明细可以参考文档：[权益明细](https://rubickcenter.github.io/rubick/super/)

<img width=400 src=https://picx.zhimg.com/80/v2-6deabf65175d18080439ef813102d18c_720w.png />

## 安装包
* [Rubick Mac OS](https://github.com/rubickCenter/rubick/releases)
* [Rubick Windows](https://github.com/rubickCenter/rubick/releases)
* [Rubick Linux](https://github.com/rubickCenter/rubick/releases)

## 支持能力
- [x] 基于 npm 包模式的插件管理，安装插件和安装 npm 包一样简单
- [x] 支持 webdav 多端数据同步，真正的数据安全同步
- [x] 独一无二的系统插件模式，让插件成为 rubick 的一部分
- [x] 支持快速启动本地 app、文件、文件夹
- [x] 支持企业化内网部署
- [x] 支持多语言

## 使用文档

[Rubick 官网](https://rubick.vip)

[Rubick Docs](https://rubickCenter.github.io/rubick/)


## 核心功能展示
### 1. 搜索系统应用
支持拼音和缩写来搜索系统安装应用：

![](https://pic1.zhimg.com/80/v2-70c105ff7fb1e955fc67ffa5a5564092_720w.gif)

### 2. UI类插件安装
点击搜索框右侧 `rubick` 图标，进入插件市场，选择所需插件，点击下载按钮即可下载，下载完成后在已安装 tab 下可以找到安装插件。
安装完成后，输入插件呼起命令即可使用对应插件：

![](https://pic1.zhimg.com/80/v2-5906bba20fe0a67f9e7a5a8c11341305_720w.gif)

### 3. 系统类插件安装
系统插件安装方式和UI类一样，在插件市场选择`系统分类`，寻找适合自己的系统插件安装即可。

```
系统插件安装成功后，需要重启 rubick 才能生效
```

### 4. 基于 webdav 的多端数据同步
在 `rubick` 内搜索`偏好设置` 进入 `账户和设置` -> `多端数据同步`；即可对 `rubick` 插件使用数据进行 `导出` 和 `导入`。

![](https://pic1.zhimg.com/80/v2-ff85793741e4dff82a729d3eb3d41551_720w.png)

### 更多功能
如果您还需要更多功能，欢迎来这里给我们提建议：[issues](https://github.com/rubickCenter/rubick/issues) 。
有价值的想法我们会加入到后期的开发当中。同时也欢迎一起加入共建。

## 贡献
This project exists thanks to all the people who contribute. [[Contribute](https://github.com/rubickCenter/rubick/graphs/contributors)]. <a href="https://github.com/rubickCenter/rubick/graphs/contributors"><img src="https://opencollective.com/rubick/contributors.svg?width=890&button=false" /></a>

## 反馈
对本项目有兴趣或者想要交流学习的同学可以扫码加下面的微信，备注 rubick，帮助我们更好的成长：

![image](https://user-images.githubusercontent.com/21073039/127327603-9796f246-ee4b-4950-a69d-ce3205ec9569.png)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/rubickCenter/rubick/blob/master/LICENSE) file for details.

