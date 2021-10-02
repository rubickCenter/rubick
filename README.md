English | [简体中文](https://github.com/clouDr-f2e/rubick/blob/master/README.zh-CN.md)

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


Based on electron open source toolbox, free integration of rich plug-ins, to create the ultimate desktop efficiency tool。Rubick is one of the heroes of Dota ，The core skill is the ability to use other heroes as plug-ins，Finished the walk 。Very consistent with the design concept of this tool，So named Rubick。

## Installation package
* [Rubick Mac OS](https://github.com/clouDr-f2e/rubick/releases)
* [Rubick Windows](https://github.com/clouDr-f2e/rubick/releases)
* [Rubick Linux](https://github.com/clouDr-f2e/rubick/releases)

## Feature list
- [x] Support remote download plug-in installation, support plug-in developer mode
- [x] Support plug-in separation
- [x] Support system command color picker、screen capture、 help
- [x] Support super panel, long press and right click to make a call
- [x] Support global shortcut key Settings
- [x] You can search for locally installed APPS or preferences
- [x] Support macos touchBar arouse the plug-in
- [x] Support Windows
- [x] Support Linux



![example.gif](https://user-images.githubusercontent.com/21073039/128359309-2377d3cf-7b70-4e8f-9973-ae8f337a8006.gif)

## Docs

[Rubick Docs](https://cloudr-f2e.github.io/rubick/)


## Tips
If you're in a development environment，Run `npm run rebuild` after install。

## Current support capability

### touchBar
macOS support touchbar Quick recall plug-in

![2oyn8-wu97m (3)](https://user-images.githubusercontent.com/21073039/129894362-1dbb8436-921c-4138-be9c-072dc2e62549.gif)

### Super Panel
Long press the right mouse button to call up the super panel. You can select content according to the current mouse and match the ability of the plug-in. For example, after selecting a picture, long press and right click to call up the plug-in to upload the picture bed.

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1706cc730f1f46078cb700a445211317~tplv-k3u1fbpfcp-watermark.image)

### Template
A template is a built-in UI-style function plug-in.

<img src=https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b113ad547974699b9c73c28bc09b9b1~tplv-k3u1fbpfcp-watermark.image width=500 />

### System Command
#### Color picker
Based on `robot.js` and `iohook`。

![image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3036ae85bf3549fc8bbbe2926ecbad55~tplv-k3u1fbpfcp-watermark.image)

#### Screen capture

<img src=https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18023dab52e1420c9e87362cefddb2a1~tplv-k3u1fbpfcp-watermark.image width=500 />


#### Global Hotkeys

<img src=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62cc424eacac4c9eb178f0e055e87d9a~tplv-k3u1fbpfcp-watermark.image width=500 />

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)]. <a href="https://github.com/clouDr-f2e/rubick/graphs/contributors"><img src="https://opencollective.com/rubick/contributors.svg?width=890&button=false" /></a>
## Feedback
对本项目有兴趣或者想要交流学习的同学可以扫码加下面的微信，备注 rubick，帮助我们更好的成长：

![image](https://user-images.githubusercontent.com/21073039/127327603-9796f246-ee4b-4950-a69d-ce3205ec9569.png)

扫码关注 Rubick 官微, 获取最新动态：

![wechat](https://z3.ax1x.com/2021/09/26/4yRpN9.jpg)

## ChangeLog
[CHANGELOG](https://github.com/clouDr-f2e/rubick/blob/master/CHANGELOG.md)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/clouDr-f2e/rubick/blob/master/LICENSE) file for details.

