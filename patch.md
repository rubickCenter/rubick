# 安装iohook

1. .\node_modules\iohook\install.js 修改downloadUrl为

    ```js
    let downloadUrl =
        'https://ghproxy.com/https://github.com/wilix-team/iohook/releases/download/v' +
        pkgVersion +
        '/' +
        currentPlatform +
        '.tar.gz';
    ```

2. node .\node_modules\iohook\install.js #安装iohook
3. npm run rebuild_win

"robotjs": "git+https://ghproxy.com/https://github.com/Toinane/robotjs.git",
