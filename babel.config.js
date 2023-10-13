module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: 'css', // or 'css'
      },
      'ant-design-vue',
    ],
    [
      'import',
      {
        libraryName: '@ant-design/icons-vue',
        libraryDirectory: 'lib/icons',
        camel2DashComponentName: false,
      },
      '@ant-design/icons-vue',
    ],
  ],
};
