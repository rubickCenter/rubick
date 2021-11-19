// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src/renderer"),
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.ts',
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
      },
      chainWebpackRendererProcess: (config) => {
        config.entryPoints.clear(); // 清空默认入口
        config.entry('test').add(path.join(__dirname, "./src/renderer/main.ts")); // 重新设置
      },
    },
  },
};
