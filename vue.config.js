// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  // transpileDependencies: ["fix-path"],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
      },
    },
    externals: {
      'extract-file-icon': 'commonjs extract-file-icon',
    },
  },
  pages: {
    index: {
      entry: 'src/renderer/main.ts',
    },
  },
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/main/index.ts',
      mainProcessWatch: ['src/main'],
      externals: ['pouchdb', 'extract-file-icon', 'electron-screenshots'],
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      builderOptions: {
        productName: 'rubick2',
        appId: 'com.muwoo.rubick',
        compression: 'maximum',
        directories: {
          output: 'build',
        },
        releaseInfo: {
          releaseName: 'normal', // normal 弹窗 / major 强制更新
          releaseNotesFile: './release/releaseNotes.md',
        },
        publish: [
          {
            provider: 'github',
            owner: 'rubickCenter',
            repo: 'rubick',
          },
        ],
        // files: ["dist_electron/**/*"],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },
        mac: {
          icon: 'public/icons/icon.icns',
          target: ['pkg'],
          extendInfo: {
            LSUIElement: 1,
          },
        },
        win: {
          icon: 'public/icons/icon.ico',
          target: 'nsis',
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        linux: {
          icon: 'public/icons/',
          publish: ['github'],
          target: 'deb',
        },
      },
    },
  },
};
