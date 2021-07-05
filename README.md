<div align= "center">
<img align="center" src="https://user-images.githubusercontent.com/21073039/123022701-c3848180-d408-11eb-86ec-7727f355ea96.png" />
</div>

<h1 align= "center">Rubick</h1>

基于 electron 的工具箱，媲美 utools的开源插件，已实现 utools 大部分的 API 能力，所以可以做到无缝适配 utools 开源的插件。
之所以做这个工具箱一方面是 utools 本身并未开源，但是公司内部的工具库又无法发布到 utools 插件中，所以为了既要享受 utools 生态又要有定制化需求，我们自己参考 utools 设计，做了 Rubick

## 安装包
* [Rubick Mac OS V0.0.1](https://github.com/clouDr-f2e/rubick/releases/download/v0.0.1-beta/rubick2-0.0.1.pkg)

## 支持能力

- [x] 支持 uTools 官方文档 90% API，还在更新中，很快可以做到 100%
- [x] 插件化支持 uTools 所有开源插件
- [x] 支持远程下载安装插件，支持插件开发者模式
- [x] 支持插件分离
- [x] 支持系统命令取色、截屏、帮助
- [x] 支持超级面板，长按右击呼出
- [x] 支持全局快捷键设置
- [x] 支持搜索本地已安装 app 或 偏好设置
- [ ] 支持 Windows
- [ ] 支持 Linux

![image](https://user-images.githubusercontent.com/21073039/122888869-d6e60d00-d374-11eb-9fb9-2a6e541e389e.png)

## 使用问题
1. 目前 `Rubick` 插件市场 server 端还没有部署，所以目前看不到插件市场的插件。
2. 依赖于 `robotjs` dev 环境运行请在 `install` 后执行 `npm run rebuild`

## utools 插件支持
### plugin.json
在你觉得合适的地方新建一个文件夹，并创建 `plugin.json` 文件。这是最重要的一个文件，用来说明这个插件将如何与 `rubick` 集成，最基本的格式如下：
```json
{
	"pluginName": "helloWorld",
	"description": "我的第一个uTools插件",
	"main": "index.html",
	"version": "0.0.1",
	"logo": "logo.png",
	"features": [
		{
		  "code": "hello",
		  "explain": "hello world",
			"cmds":["hello", "你好"]
		}
	]
}
```
所有字段和 `utools` 保持一致，这将可以完美使用`utools`的插件生态

## utools api 支持

### 事件

#### onPluginReady(callback)
* `callback` Function

> 当插件装载成功，uTools 将会主动调用这个方法（生命周期内仅调用一次），所有的 `api` 都应该在 `onPluginReady` 之后进行调用。

##### 示例

```js
utools.onPluginReady(() => {
  console.log('插件装配完成，已准备好')
})
```

#### onPluginEnter(callback)
* `callback` Function

> 每当插件从后台进入到前台时，uTools 将会主动调用这个方法。

##### 示例

```js
utools.onPluginEnter(({code, type, payload, optional}) => {
  console.log('用户进入插件', code, type, payload)
})
```

更多可以参考 `utools` 文档：https://u.tools/docs/developer/api.html#%E4%BA%8B%E4%BB%B6

### 窗口交互


### 本地数据库
类似于 `utools` 的功能，我们也提供了本地数据库的 api 能力

#### utools.db.put(doc)

##### 示例
```js
// 创建请求
utools.db.put({
  _id: "demo",
  data: "demo"
})
// 返回 {id: "demo", ok: true, rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"}

// 更新请求
utools.db.put({
  _id: "demo",
  data: "demo",
  _rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"
})

```

#### utools.db.get(id)
#### utools.db.remove(doc)
#### utools.db.bulkDocs(docs)

### ubrowser
可编程浏览器

```js
  const page = await utools.ubrowser.goto('https://www.baidu.com')
  await page.value('#kw', 'uTools');
  await page.click('#su');
  page.run({
      width: 600,
      height: 800,
    })
```

### 最后
utools过于强大，目前还没有完全实现其所有功能，不过我们会根据需要不断更新。欢迎小伙伴一起 `pr` 或 `star`


## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/clouDr-f2e/rubick/blob/master/LICENSE) file for details.

