import { LocalDb } from '@/core';
import { app } from 'electron';

const dbInstance = new LocalDb(app.getPath('userData'));
dbInstance.init();

export default class DBInstance {
  public currentPlugin: null | any = null;
  private DBKEY = 'RUBICK_DB_DEFAULT';
  private DB_INFO_KET = 'RUBICK_PLUGIN_INFO';
  public async dbPut({ data }) {
    // 记录插件有哪些 dbkey，用于后续的数据同步
    if (this.currentPlugin && this.currentPlugin.name) {
      let dbInfo: any = await dbInstance.get(this.DBKEY, this.DB_INFO_KET);
      if (!dbInfo) {
        dbInfo = { data: [], _id: this.DB_INFO_KET };
      }
      const item = dbInfo.data.find(
        (it) => it.name === this.currentPlugin.name
      );
      if (item) {
        !item.keys.includes(data.data._id) && item.keys.push(data.data._id);
      } else {
        dbInfo.data.push({
          name: this.currentPlugin.name,
          keys: [data.data._id],
        });
      }
      dbInstance.put(this.DBKEY, dbInfo);
    }
    return dbInstance.put(this.DBKEY, data.data);
  }

  public dbGet({ data }) {
    return dbInstance.get(this.DBKEY, data.id);
  }

  public dbRemove({ data }) {
    return dbInstance.remove(this.DBKEY, data.doc);
  }

  public dbBulkDocs({ data }) {
    return dbInstance.bulkDocs(this.DBKEY, data.docs);
  }

  public dbAllDocs({ data }) {
    return dbInstance.allDocs(this.DBKEY, data.key);
  }

  public dbDump({ data }) {
    return dbInstance.dumpDb(data.target);
  }

  public dbImport({ data }) {
    return dbInstance.importDb(data.target);
  }

  public dbPostAttachment({ data }) {
    const { docId, attachment, type } = data;
    return dbInstance.postAttachment(this.DBKEY, docId, attachment, type);
  }

  public dbGetAttachment({ data }) {
    return dbInstance.getAttachment(this.DBKEY, data.docId);
  }

  public async dbGetAttachmentType({ data }) {
    const res: any = await this.dbGet(data.docId);
    if (!res || !res._attachments) return null;
    const result = res._attachments[0];
    return result ? result.content_type : null;
  }
}
