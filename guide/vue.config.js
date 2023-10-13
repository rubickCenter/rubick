const path = require('path');

module.exports = {
  css: {
    // 配置css模块
    loaderOptions: {
      // 向预处理器 Loader 传递配置选项
      less: {
        // 配置less（其他样式解析用法一致）
        javascriptEnabled: true, // 设置为true
      },
    },
  },
  productionSourceMap: false,
  outputDir: path.join(__dirname, '../public/guide'),
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
};
