import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
});

export default {
  async getScanCode({ scene }: { scene: string }) {
    const res = await instance.get('/users/getScanCode', {
      params: {
        scene,
      },
    });
    return res.data;
  },

  async checkLoginStatus({ scene }: { scene: string }) {
    const res = await instance.post('/users/checkLoginStatus', {
      scene,
    });
    return res.data;
  },

  async getUserInfo({ openId }: { openId: string }) {
    const res = await instance.post('/users/getUserInfo', {
      openId,
    });
    return res.data;
  },
};
