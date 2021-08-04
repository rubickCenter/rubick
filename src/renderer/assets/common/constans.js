const WINDOW_MAX_HEIGHT = 600;
const WINDOW_MIN_HEIGHT = 60;
const PRE_ITEM_HEIGHT = 60;

const SYSTEM_PLUGINS = [
  {
    pluginName: 'rubick 帮助文档',
    logo: require('../imgs/help.png'),
    features: [
      {
        code: 'help',
        explain: 'rubick 帮助文档',
        cmds: ['Help', '帮助']
      }
    ],
    tag: 'rubick-help'
  },
  {
    pluginName: '屏幕颜色拾取',
    logo: require('../imgs/picker.png'),
    features: [
      {
        code: 'pick',
        explain: 'rubick 帮助文档',
        cmds: ['取色', '拾色', 'Pick color', 'qs', 'ss']
      }
    ],
    tag: 'rubick-color'
  },
  {
    pluginName: '截屏',
    logo: require('../imgs/screenshot.png'),
    features: [
      {
        code: 'shortCut',
        explain: 'rubick 屏幕截取',
        cmds: ['截屏', 'shortCut', 'jp']
      }
    ],
    tag: 'rubick-screen-short-cut'
  },
  {
    pluginName: '锁屏',
    logo: require('../imgs/lock.png'),
    features: [
      {
        code: 'lock',
        explain: '锁屏',
        cmds: ['锁屏', 'lock screen', 'sp']
      }
    ],
    tag: 'rubick-lock'
  }
];

const APP_FINDER_PATH = process.platform === 'darwin' ? ['/System/Applications', '/Applications', '/System/Library/PreferencePanes'] : [];

export { WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS, APP_FINDER_PATH };
