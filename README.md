<div align= "center">
<img align="center" width=200 src="https://user-images.githubusercontent.com/21073039/128333805-73e086f0-5523-46a3-a096-cba80b904c46.png" />
</div>


<div align= "center">
 <h1>Rubick</h1>

 <a href="https://github.com/clouDr-f2e/rubick/releases/tag/v0.0.1-beta">
    <img alt="release" src="https://img.shields.io/badge/release-v0.0.1-brightgreen" />
 </a>
 <a href="https://github.com/clouDr-f2e/rubick/blob/master/LICENSE">
    <img alt="npm" src="https://img.shields.io/github/license/clouDr-f2e/rubick" />
 </a>
</div>


基于 electron 的工具箱。Rubick(拉比克) 是 dota 里面的英雄之一，其核心技能是插件化使用其他英雄的技能，用完即走。非常符合本工具的设计理念，所以取名 Rubick。

## 安装包
* [Rubick Mac OS V0.0.3-beta.1](https://github.com/clouDr-f2e/rubick/releases/tag/v0.0.3-beta.1)
* [Rubick Windows V0.0.2-beta.2](https://github.com/clouDr-f2e/rubick/releases/download/v0.0.2-beta.2/rubick2.Setup.0.0.2-beta.2.exe)

## 支持能力。
- [x] 支持远程下载安装插件，支持插件开发者模式
- [x] 支持插件分离
- [x] 支持系统命令取色、截屏、帮助
- [x] 支持超级面板，长按右击呼出
- [x] 支持全局快捷键设置
- [x] 支持搜索本地已安装 app 或 偏好设置
- [x] 支持 Windows(目前是 mac 的 alpha 版本，功能尚不全，正在迁移中)
- [ ] 支持 Linux


![QQ20210705-210753](https://user-images.githubusercontent.com/21073039/124477360-8770f980-ddd6-11eb-8dc3-ba318223697f.gif)



## 使用问题
1. 依赖于 `robotjs` dev 环境运行请在 `install` 后执行 `npm run rebuild`
2. windows 版本目前有了一个最基础的可用版，代码在 [feat-win](https://github.com/clouDr-f2e/rubick/tree/feat-win) 分支。完整版正在开发中，敬请期待

## 目前支持能力

### 超级面板
长按鼠标右键，即可呼起超级面板，可以根据当前鼠标选择内容，匹配对应插件能力。比如当前选择图片后长按右击，则会呼起上传图床插件：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1706cc730f1f46078cb700a445211317~tplv-k3u1fbpfcp-watermark.image)

### 模板
为了更贴合 `uTools` 的插件能力，需要实现模板功能，模板即是一个内置 UI 样式的功能插件。

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

