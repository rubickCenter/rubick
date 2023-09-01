import { LocalDb } from '@/core';
import { app } from 'electron';

const dbInstance = new LocalDb(app.getPath('userData'));
dbInstance.init();

export default class DBInstance {
  private DBKEY = 'RUBICK_DB_DEFAULT';
  public dbPut({ data }) {
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
}
