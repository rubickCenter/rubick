English | [简体中文](./README.zh-CN.md)


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
   <img alt=building src=https://img.shields.io/github/actions/workflow/status/rubickCenter/rubick/main.yml>
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

An open-source toolbox based on Electron, freely integrating rich plugins to create the ultimate desktop productivity tool. Rubick is one of the heroes in Dota, whose core skill is the ability to use the skills of other heroes through plugins, and then move on. This aligns perfectly with the design philosophy of this tool, which is why it is named Rubick.

## Sponsor
我们通过有偿的方式积累高质量的常见问题、最佳实践文档，加入星球后可以和作者进行互动和答疑。我们提供技术支持、答疑解惑、定制化插件开发、二次定制化开发 rubick 等等官方服务。

权益明细可以参考文档：[权益明细](https://rubickcenter.github.io/rubick/super/)

<img width=400 src=https://picx.zhimg.com/80/v2-6deabf65175d18080439ef813102d18c_720w.png />

## Installation package
* [Rubick Mac OS](https://github.com/rubickCenter/rubick/releases)
* [Rubick Windows](https://github.com/rubickCenter/rubick/releases)
* [Rubick Linux](https://github.com/rubickCenter/rubick/releases)


## Feature list
- [x] Plugin management based on the npm package pattern, installing plugins is as simple as installing npm packages.
- [x] Supports WebDAV for multi-device data synchronization, ensuring true data security synchronization.
- [x] A unique system plugin mode that allows plugins to become an integral part of Rubick.
- [x] Supports the quick launch of local apps, files, and folders.
- [x] Supports enterprise-level intranet deployment.
- [x] Supports multiple languages.

## Docs

[Rubick website](https://rubick.vip)

[Rubick Docs](https://rubickCenter.github.io/rubick/)


##  Core functionality showcase.
### 1. Search system application
Support pinyin and abbreviations to search system applications：

![](https://pic1.zhimg.com/80/v2-70c105ff7fb1e955fc67ffa5a5564092_720w.gif)

### 2. UI plug-in installation
Click the `rubick` icon on the right side of the search box to enter the plug-in market, select the desired plug-in, and click the download button to download. After the download is complete, you can find the installed plug-in under the Installed tab

After the installation is complete, enter the plug-in call up command to use the corresponding plug-in：

![](https://pic1.zhimg.com/80/v2-5906bba20fe0a67f9e7a5a8c11341305_720w.gif)

### 3. System plug-in installation
The system plug-in installation method is the same as that of the UI category. In the plug-in market, select the `system category` and find the system plug-in that suits you to install it.
```
After the system plug-in is installed successfully, rubick needs to be restarted to take effect
```

### 4. Multi-device data synchronization based on WebDAV.
In "Rubick," search for "Preferences," go to "Account and Settings," and then select "Multi-Device Data Synchronization." You can export and import data for the use of Rubick plugins.

![](https://pic1.zhimg.com/80/v2-ff85793741e4dff82a729d3eb3d41551_720w.png)

### More features
If you need more features, please come here to give us suggestions：[issues](https://github.com/rubickCenter/rubick/issues) 。
We will add valuable ideas to the later development. At the same time, welcome to join and build together。

## 贡献
This project exists thanks to all the people who contribute. [[Contribute](https://github.com/rubickCenter/rubick/graphs/contributors)]. <a href="https://github.com/rubickCenter/rubick/graphs/contributors"><img src="https://opencollective.com/rubick/contributors.svg?width=890&button=false" /></a>

## 反馈
对本项目有兴趣或者想要交流学习的同学可以扫码加下面的微信，备注 rubick，帮助我们更好的成长：

![image](https://user-images.githubusercontent.com/21073039/127327603-9796f246-ee4b-4950-a69d-ce3205ec9569.png)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/rubickCenter/rubick/blob/master/LICENSE) file for details.
