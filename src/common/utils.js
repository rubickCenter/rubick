export const getlocalDataFile = () => {
  let localDataFile = process.env.HOME;
  if (!localDataFile) {
    localDataFile = process.env.LOCALAPPDATA;
  }
  return localDataFile;
};
