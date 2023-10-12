import defaultConfig from '@/common/constans/defaultConfig';
import DBInstance from './db';
const LOCAL_CONFIG_KEY = 'rubick-local-config';

const db = new DBInstance();

const localConfig = {
  async init(): Promise<any> {
    const localConfig: any = await db.dbGet({ data: { id: LOCAL_CONFIG_KEY } });
    if (
      !localConfig ||
      !localConfig.data ||
      localConfig.data.version !== defaultConfig.version
    ) {
      const data: any = {
        _id: LOCAL_CONFIG_KEY,
        data: defaultConfig,
      };
      if (localConfig && localConfig) {
        data._rev = localConfig._rev;
      }
      await db.dbPut({
        data: { data },
      });
    }
  },
  async getConfig(): Promise<any> {
    const data: any =
      (await db.dbGet({ data: { id: LOCAL_CONFIG_KEY } })) || {};
    return data.data;
  },

  async setConfig(data) {
    const localConfig: any =
      (await db.dbGet({ data: { id: LOCAL_CONFIG_KEY } })) || {};
    await db.dbPut({
      data: {
        data: {
          _id: LOCAL_CONFIG_KEY,
          _rev: localConfig._rev,
          data: {
            ...localConfig.data,
            ...data,
          },
        },
      },
    });
  },
};

export default localConfig;
