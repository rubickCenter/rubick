## 事件

### onPluginReady(callback)、onPluginEnter(callback)

* `callback` Function

`callback` 内会返回一个 `object` 对象，来描述进入当前插件的环境信息：

* `code` String

> plugin.json 配置的 feature.code

* `type` String

> plugin.json 配置的 feature.cmd.type，可以为 "text"、"img"、 "files"、 "regex"、 "over"、"window"

* payload String | Object | Array

> feature.cmd.type 对应匹配的数据

当插件装载成功，rubick 将会主动调用这个方法, 所有的 `api` 都应该在 `onPluginReady` 之后进行调用。

#### 示例

```js
rubick.onPluginReady(({ code, type, payload }) => {
  console.log('插件装配完成，已准备好')
})
/* 
type 为 "files" 时， payload 值示例
[
	{
		"isFile": true,
		"isDirectory": false,
		"name": "demo.js",
		"path": "C:\\demo.js"
	}
]

type 为 "img" 时， payload 值示例
data:image/png;base64,...

type 为 "text"、"regex"、 "over" 时， payload 值为进入插件时的主输入框文本
*/
```

### onPluginOut(callback)

* `callback` Function

每当插件从前台进入到后台时，rubick 将会主动调用这个方法。

## 窗口交互

### hideMainWindow()

隐藏主窗口

### showMainWindow()

显示主窗口

### setExpendHeight(height)

执行该方法将会修改插件窗口的高度。

* `height` Integer
* 返回 `Boolean`

#### 示例

```js
rubick.setExpendHeight(100)
```

### setSubInput(onChange, placeholder)

设置插件输入框监听，当进入插件后，用户搜索会触发`onChange` 函数

* `onChange` Function
    * `Object`
        * `text` String

> 子输入框文本修改时触发

* `placeholder` String (可选)

> 子输入框占位符

* `isFocus` Boolean (可选)

> 子输入框是否获得焦点，默认 true

`返回 Boolean`

#### 示例

```js
rubick.setSubInput(({ text }) => {
  console.log(text)
}, '搜索')
```

### setSubInputValue(value)

直接对子输入框的值进行设置。

* `value` String
* `返回` Boolean

#### 示例

```js
rubick.setSubInputValue('rubick')
```

## 系统
### showNotification(body)
显示系统通知

* `body` String
```js
rubick.showNotification('Hi, rubick')
```

### shellOpenPath(fullPath)
打开给定路径的文件

* `fullPath` String

```js
rubick.shellOpenPath('/path/file')
```

### shellOpenExternal(url)
浏览器打开URL

* `url` String

```js
rubick.shellOpenExternal('https://www.baidu.com')
```

### getPath(name)
electron 内置 getPath 能力，详见 [electron API](https://www.electronjs.org/docs/latest/api/app#appgetpathname)

```js
console.log(rubick.getPath('cache'));
```

## 本地数据库

`rubick db` 是基于开源的 [pouchdb](https://github.com/pouchdb/pouchdb) 封装的

### rubick.db.put(doc)

* `doc` Object
* `返回` Object

#### 示例

```js
// 创建请求
rubick.db.put({
  _id: "demo",
  data: "demo"
})
// 返回 {id: "demo", ok: true, rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"}

// 更新请求
rubick.db.put({
  _id: "demo",
  data: "demo",
  _rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"
})
```

_id 代表这个文档在数据库中唯一值，如果值不存在，则会创建一个新的文档，如果值已经存在，则会进行更新。你可能已经注意到，返回对象中包含一个 rev
属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败，版本化的意义在于解决同步时数据冲突。

另外需要注意，每次更新时都要传入完整的文档数据，无法对单个字段进行更新。

### rubick.db.get(id)

执行该方法将会根据文档 ID 获取数据

* `id` String
* `返回` Object

```js
rubick.db.get("demo")
// 返回 {_id: "demo", _rev: "3-9836c5c68af5aef618e17d615882942a", data: "demo"}
```

### rubick.db.remove(doc)

* `doc` String | Object
* `返回` Object 执行该方法将会删除数据库文档，可以传入文档对象或文档 id 进行操作。

```js
rubick.db.remove("demo")
// 返回 {id: "demo", ok: true, rev: "2-effe5dbc23dffc180d8411b23f3108fb"}
```

### rubick.db.bulkDocs(docs)

* `docs` Array
* `返回` Array 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。

```js
rubick.db.bulkDocs([{
  _id: "demo1",
  data: "demo",
  _rev: "1-c8817a74e292eda4cba1a45924853af6"
}, {
  _id: "demo2",
  data: "demo",
  _rev: "1-f0399b42cc6123a9cc8503632ba7b3a7"
}])
/* 返回
[{
id: "demo1", ok: true, rev: "2-7857b2801bc0303d2cc0bb82e8afd796"
}, {
id: "demo2", ok: true, rev: "2-7857b2801bc0303d2cc0bb82e8afd796"
}]
*/
```

### rubick.db.allDocs(key)

* `key` String | Array
* `返回` Array 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定 ID 的数组，不传入则为获取所有文档。

```js
// 获取所有文档
rubick.db.allDocs()

// 传入字符串，则返回id以 demo 开头的文档
rubick.db.allDocs("demo")
/* 返回
[{
_id: "demo/123", _rev: "2-7857b2801bc0303d2cc0bb82e8afd796", data: "demo"
}, {
_id: "demo/124", _rev: "1-f0399b42cc6123a9cc8503632ba7b3a7", data: "demo"
}, {
_id: "demo/125", _rev: "1-f0399b42cc6123a9cc8503632ba7b3a7", data: "demo"
}]
*/
// 根据id数组请求
rubick.db.allDocs([
  "demo1",
  "demo2"
])
/* 返回
[{
_id: "demo1", _rev: "2-7857b2801bc0303d2cc0bb82e8afd796", data: "demo"
}, {
_id: "demo2", _rev: "1-f0399b42cc6123a9cc8503632ba7b3a7", data: "demo"
}]
*/
```
