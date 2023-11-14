const asar = require('@electron/asar');
const tar = require('tar');

const src = 'dist_electron/bundled';
const dest = 'build/app.asar';

(async () => {
  await asar.createPackageWithOptions(src, dest, {});
  await tar.c(
    {
      gzip: true,
      file: 'app.asar.tgz',
    },
    [dest]
  );
})();
