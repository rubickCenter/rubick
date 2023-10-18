// for referer policy, we can't use it in renderer
import axios from 'axios';
const RELEASE_URL = 'https://api.github.com/repos/rubickCenter/rubick/releases';

export const getLatestVersion = async (isCheckBetaUpdate = false) => {
  let res = '';
  try {
    res = await axios
      .get(RELEASE_URL, {
        headers: {
          Referer: 'https://github.com',
        },
      })
      .then((r) => {
        const list = r.data;
        if (isCheckBetaUpdate) {
          const betaList = list.filter((item) => item.name.includes('beta'));
          return betaList[0].name;
        }
        const normalList = list.filter((item) => !item.name.includes('beta'));
        return normalList[0].name;
      });
  } catch (err) {
    console.log(err);
  }
  return res;
};
