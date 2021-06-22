# rubick

基于 electron 的工具箱，媲美 utools的开源插件

![image](https://user-images.githubusercontent.com/21073039/122888869-d6e60d00-d374-11eb-9fb9-2a6e541e389e.png)

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

