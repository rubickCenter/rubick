exports.default = async function () {
  const tar = require('tar');
  const fs = require('fs');

  const src = './build/mac/rubick.app/Contents/Resources/app.asar';
  if (fs.existsSync(src)) {
    await tar.c(
      {
        gzip: true,
        file: 'build/app.asar.tgz',
      },
      [src]
    );
  }
};
