exports.default = async function () {
  const fs = require('fs');
  const compressing = require('compressing');

  const src = './build/mac/rubick.app/Contents/Resources/app.asar';
  if (fs.existsSync(src)) {
    await compressing.gzip.compressFile(src, 'build/app.asar.gz');
  }
};
