const WINDOW_MAX_HEIGHT = 600;
const WINDOW_MIN_HEIGHT = 60;
const PRE_ITEM_HEIGHT = 60;

const SYSTEM_PLUGINS = [
  {
    "pluginName": "rubick 帮助文档",
    "logo": "https://static.91jkys.com/activity/img/4eb6f2848b064f569c28fdf8495d5ec7.png",
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
    "logo": "https://static.91jkys.com/activity/img/6a1b4b8a17da45d680ea30b53a91aca8.png",
    "features": [
      {
        "code": "pick",
        "explain": "rubick 帮助文档",
        "cmds": [ "取色", "拾色", 'Pick color' ]
      },
    ],
    "tag": 'rubick-color',
  },
  {
    "pluginName": "截屏",
    "logo": "https://static.91jkys.com/activity/img/b34d30b426f24eb2b77bf434b8493495.png",
    "features": [
      {
        "code": "shortCut",
        "explain": "rubick 屏幕截取",
        "cmds": [ "截屏", "shortCut" ]
      },
    ],
    "tag": 'rubick-screen-short-cut',
  }
];

const APP_FINDER_PATH = [
  '/System/Applications',
  '/Applications',
  '/System/Library/PreferencePanes',
];

export {
  WINDOW_MAX_HEIGHT,
  WINDOW_MIN_HEIGHT,
  PRE_ITEM_HEIGHT,
  SYSTEM_PLUGINS,
  APP_FINDER_PATH,
}
