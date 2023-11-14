exports.default = async function () {
  const asar = require('@electron/asar');
  const tar = require('tar');

  const src = 'dist_electron/bundled';
  const dest = 'build/app.asar';

  await asar.createPackageWithOptions(src, dest, {});
  await tar.c(
    {
      gzip: true,
      file: 'build/app.asar.tgz',
    },
    [dest]
  );
};
