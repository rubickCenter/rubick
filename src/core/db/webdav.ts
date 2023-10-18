import { Notification, app } from 'electron';
import MemoryStream from 'memorystream';

import { createClient } from 'webdav';
import { WebDAVClient } from 'webdav/dist/node/types';

type WebDavOptions = {
  username: string;
  password: string;
  url: string;
};

type DBInstance = {
  loadIt: (stream: unknown, options?: any) => void;
  dump: (stream: unknown, options?: any) => void;
};

export default class WebDav {
  public client: WebDAVClient;
  private cloudPath = '/rubick/db.txt';

  constructor({ username, password, url }: WebDavOptions) {
    this.client = createClient(url, {
      username,
      password,
    });
    this.client
      .exists('/')
      .then((result) => {
        !result &&
          new Notification({
            title: '导出失败',
            body: 'webdav 连接失败',
          }).show();
      })
      .catch((r) => {
        new Notification({
          title: '导出失败',
          body: 'WebDav连接出错' + r,
        }).show();
      });
  }

  async createWriteStream(dbInstance: DBInstance): Promise<void> {
    try {
      const result = await this.client.exists('/rubick');
      if (!result) {
        await this.client.createDirectory('/rubick');
      }
    } catch (e) {
      new Notification({
        title: '导出失败',
        body: 'WebDav目录创建出错:' + e,
      }).show();
    }
    const ws = new MemoryStream();
    dbInstance.dump(ws, {
      filter: (doc) => {
        // attachment 文档导出有问题，
        return !doc._attachments;
      },
    });
    ws.pipe(
      this.client.createWriteStream(this.cloudPath, {}, () => {
        new Notification({
          title: '已导出到坚果云',
          body: `文件目录为：${this.cloudPath}`,
        }).show();
      })
    );
  }

  async createReadStream(dbInstance: DBInstance): Promise<void> {
    try {
      const result = await this.client.exists(this.cloudPath);
      if (!result) {
        return new Notification({
          title: '导入失败',
          body: '请确认坚果云上已存在数据',
        }).show();
      }
      const str = await this.client.getFileContents(this.cloudPath, {
        format: 'text',
      });
      await dbInstance.loadIt(str);
      new Notification({
        title: '导入成功',
        body: '数据已导入到 rubick，主应用数据需重启后生效',
      }).show();
    } catch (e) {
      new Notification({
        title: '导入失败',
        body: 'WebDav目录导入出错:' + e,
      }).show();
    }
  }
}
