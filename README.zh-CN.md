[English](https://github.com/clouDr-f2e/rubick/blob/master/README.md) | 简体中文


<div align= "center">
<img align="center" width=200 src="https://user-images.githubusercontent.com/21073039/128333805-73e086f0-5523-46a3-a096-cba80b904c46.png" />
</div>


<div align= "center">
 <h1>Rubick</h1>

 <img alt="release" src="https://img.shields.io/github/downloads/clouDr-f2e/rubick/total" />
 <a href="https://github.com/clouDr-f2e/rubick/releases">
    <img alt="release" src="https://img.shields.io/github/package-json/v/clouDr-f2e/rubick" />
 </a>
 <a href="https://github.com/clouDr-f2e/rubick/actions">
   <img alt=building src=https://img.shields.io/github/workflow/status/clouDr-f2e/rubick/Build>
 </a>
 <a href="https://github.com/clouDr-f2e/rubick/blob/master/LICENSE">
    <img alt="npm" src="https://img.shields.io/github/license/clouDr-f2e/rubick" />
 </a>
 <a href="https://github.com/clouDr-f2e/rubick/stargazers">
    <img alt="star" src="https://img.shields.io/github/stars/clouDr-f2e/rubick?style=social">
</a>
<a href="https://gitee.com/monkeyWang/rubick">
    <img alt="码云" src="https://img.shields.io/badge/Gitee--yellow.svg?style=social&logo=data:image/svg+xml;base64,PHN2ZyB0PSIxNTc0ODM3MTM4ODM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NzAiICAgICB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPiAgICA8cGF0aCBkPSJNODkxIDQyOC44SDQ2NS44Yy0yMC40IDAtMzcgMTYuNS0zNyAzN3Y5Mi40YzAgMjAuNCAxNi41IDM3IDM3IDM3aDI1OC45YzIwLjQgMCAzNyAxNi42IDM3IDM3djE4LjRjMCA2MS4zLTQ5LjcgMTEwLjktMTEwLjkgMTEwLjlIMjk5LjRjLTIwLjQgMC0zNy0xNi42LTM3LTM3VjM3My4yYzAtNjEuMyA0OS43LTExMC45IDExMC45LTExMC45aDUxNy42YzIwLjQgMCAzNy0xNi41IDM3LTM3bDAuMS05Mi4zYzAtMjAuNC0xNi41LTM3LTM3LTM3SDM3My4zQzIyMC4yIDk2IDk2IDIyMC4yIDk2IDM3My4zVjg5MWMwIDIwLjQgMTYuNiAzNyAzNyAzN2g1NDUuNEM4MTYuMiA5MjggOTI4IDgxNi4zIDkyOCA2NzguNFY0NjUuOGMwLTIwLjQtMTYuNi0zNy0zNy0zN3oiICAgICAgICAgIGZpbGw9IiNkODFlMDYiIHAtaWQ9IjE3NzEiPjwvcGF0aD48L3N2Zz4="/>
</a>
</div>


基于 electron 的开源工具箱，自由集成丰富插件，打造极致的桌面端效能工具。Rubick(拉比克) 是 dota 里面的英雄之一，其核心技能是插件化使用其他英雄的技能，用完即走。非常符合本工具的设计理念，所以取名 Rubick。

## 安装包
* [Rubick Mac OS](https://github.com/clouDr-f2e/rubick/releases)
* [Rubick Windows](https://github.com/clouDr-f2e/rubick/releases)
* [Rubick Linux](https://github.com/clouDr-f2e/rubick/releases)

## 支持能力
- [x] 支持远程下载安装插件，支持插件开发者模式
- [x] 支持插件分离
- [x] 支持系统命令取色、截屏、帮助
- [x] 支持超级面板，长按右击呼出
- [x] 支持全局快捷键设置
- [x] 支持搜索本地已安装 app 或 偏好设置
- [x] macos touchBar 唤起插件
- [x] 支持 Windows
- [x] 支持 Linux



![example.gif](https://user-images.githubusercontent.com/21073039/128359309-2377d3cf-7b70-4e8f-9973-ae8f337a8006.gif)

## 使用文档

[Rubick Docs](https://cloudr-f2e.github.io/rubick/)


## 使用问题
依赖于 `robotjs` dev 环境运行请在 `install` 后执行 `npm run rebuild`

## 目前支持能力

### touchBar 唤起插件
macOS 支持 touchbar 快速唤起插件

![2oyn8-wu97m (3)](https://user-images.githubusercontent.com/21073039/129894362-1dbb8436-921c-4138-be9c-072dc2e62549.gif)


### 超级面板
长按鼠标右键，即可呼起超级面板，可以根据当前鼠标选择内容，匹配对应插件能力。比如当前选择图片后长按右击，则会呼起上传图床插件：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1706cc730f1f46078cb700a445211317~tplv-k3u1fbpfcp-watermark.image)

### 模板
模板即是一个内置 UI 样式的功能插件。

<img src=https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b113ad547974699b9c73c28bc09b9b1~tplv-k3u1fbpfcp-watermark.image width=500 />

### 系统命令
#### 取色
基于 `robot.js` 以及 `iohook` 实现。未使用 C++ 扩展。

![image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3036ae85bf3549fc8bbbe2926ecbad55~tplv-k3u1fbpfcp-watermark.image)

#### 截屏

<img src=https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18023dab52e1420c9e87362cefddb2a1~tplv-k3u1fbpfcp-watermark.image width=500 />


#### 全局快捷键

<img src=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62cc424eacac4c9eb178f0e055e87d9a~tplv-k3u1fbpfcp-watermark.image width=500 />

### 最后
对本项目有兴趣或者想要交流学习的同学可以扫码加下面的微信，备注 rubick，帮助我们更好的成长：

![image](https://user-images.githubusercontent.com/21073039/127327603-9796f246-ee4b-4950-a69d-ce3205ec9569.png)


## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/clouDr-f2e/rubick/blob/master/LICENSE) file for details.

