## 赞助
`rubick` 是非盈利项目，开源不容易，如果该项目对你有用的话，可以打赏我们喝杯 coffee ☕️.

<img width=200 src=https://pic1.zhimg.com/80/v2-688385687a37e962fe32daf136139feb_720w.png />
<img width=200 src=https://pica.zhimg.com/80/v2-1ba296fd2cece45ee1094ee7c259035c_720w.png />

## 贡献代码
### rubick 目录介绍

```shell
.
├── docs # 文档存方目录
│   ├── docs
│   ├── package-lock.json
│   ├── package.json
│   └── pnpm-lock.yaml
├── feature # 插件市场插件
│   ├── README.md
│   ├── babel.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tsconfig.json
│   └── vue.config.js
├── public # rubick __static 目录
│   ├── favicon.ico
│   ├── feature
│   ├── icons
│   ├── index.html
│   ├── preload.js
│   └── tpl
├── src # rubick 核心源码
│   ├── common # 一些通用的函数
│   ├── core # 一些核心的能力，比如 app search
│   ├── main # 主进程
│   └── renderer # 渲染进程
├── tpl # rubick 模板插件
│   ├── README.md
│   ├── babel.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tsconfig.json
│   └── vue.config.js
├── LICENSE # MIT 协议
├── README.md # 英文文档
├── README.zh-CN.md # 中文文档
├── babel.config.js
├── deploy-doc.sh # rubick doc 发布脚本
├── tsconfig.json
├── package-lock.json
├── package.json
└── vue.config.js
```

### 启动
#### 1. 安装依赖
`rubick` 启动主要涉及到3个目录：
1. 根目录：`rubick` 核心进程
2. feature：`rubick` 内置的插件市场插件
3. tpl: `rubick` 内置的模板插件
```shell
$ npm i
$ cd feature && npm i
$ cd tpl && npm i
```

#### 2. 启动核心进程 

```shell
$ npm run electron:serve
```

#### 3. 启动插件中心 <Badge type="warning" text="非必须" vertical="top" />

```shell
$ cd feature && npm run serve
```

#### 4. 启动模板插件 <Badge type="warning" text="非必须" vertical="top" />

```shell
$ cd tpl && npm run serve
```

### 编译
```shell
$ cd feature && npm run build
$ cd tpl && npm run build
$ npm run electron:build
```

### PR

1. Create an issue about the features, such as new components.
2. Fork the repo to your own account.
3. Clone your fork.
4. Create a new branch base on dev, if you want to add new component, the branch name should be formatted as component-[Component Name]. (e.g. component-steps) And the commit info should be formatted as [Component Name]: Info about commit.
5. Make sure that running npm run prepublish outputs the correct files.
6. Rebase before creating a PR to keep commit history clear. (Merge request to branch dev)
7. Provide some description about your PR.
