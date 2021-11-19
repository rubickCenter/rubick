// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src/renderer"),
      },
    },
  },
  pages: {
    index: {
      entry: "src/renderer/main.ts",
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/main/index.ts",
      mainProcessWatch: ["src/main"],
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      builderOptions: {
        productName: "rubick2",
        appId: "com.muwoo.rubick",
        compression: "maximum",
        directories: {
          output: "build",
        },
        files: ["dist/electron/**/*"],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications",
            },
            {
              x: 130,
              y: 150,
              type: "file",
            },
          ],
        },
        mac: {
          icon: "build/icons/icon.icns",
          target: "pkg",
          extendInfo: {
            LSUIElement: 1,
          },
        },
        win: {
          icon: "build/icons/icon.ico",
          target: "nsis",
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        linux: {
          icon: "build/icons/",
          publish: ["github"],
        },
      },
    },
  },
};
