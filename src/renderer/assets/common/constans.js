const WINDOW_MAX_HEIGHT = 600;
const WINDOW_MIN_HEIGHT = 60;
const PRE_ITEM_HEIGHT = 60;

const SYSTEM_PLUGINS = [
  {
    "pluginName": "rubick 帮助文档",
    "logo": "logo.png",
    "features": [
      {
        "code": "help",
        "explain": "rubick 帮助文档",
        "cmds": [ "Help", "帮助" ]
      },
    ],
    "tag": 'rubick-help',
  },
  {
    "pluginName": "屏幕颜色拾取",
    "logo": "logo.png",
    "features": [
      {
        "code": "pick",
        "explain": "rubick 帮助文档",
        "cmds": [ "取色", "拾色", 'Pick color' ]
      },
    ],
    "tag": 'rubick-color',
  }
]

export {
  WINDOW_MAX_HEIGHT,
  WINDOW_MIN_HEIGHT,
  PRE_ITEM_HEIGHT,
  SYSTEM_PLUGINS,
}
