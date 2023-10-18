import path from 'path';
import fs from 'fs';
import PouchDB from 'pouchdb';
import { DBError, Doc, DocRes } from './types';
import WebDavOP from './webdav';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const replicationStream = require('pouchdb-replication-stream/dist/pouchdb.replication-stream.min.js');
// const load = require('pouchdb-load/dist/pouchdb.load.min.js');

PouchDB.plugin(replicationStream.plugin);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const load = require('pouchdb-load');
PouchDB.plugin({ loadIt: load.load });
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

export default class DB {
  readonly docMaxByteLength;
  readonly docAttachmentMaxByteLength;
  public dbpath;
  public defaultDbName;
  public pouchDB: any;

  constructor(dbPath: string) {
    this.docMaxByteLength = 2 * 1024 * 1024; // 2M
    this.docAttachmentMaxByteLength = 20 * 1024 * 1024; // 20M
    this.dbpath = dbPath;
    this.defaultDbName = path.join(dbPath, 'default');
  }

  init(): void {
    fs.existsSync(this.dbpath) || fs.mkdirSync(this.dbpath);
    this.pouchDB = new PouchDB(this.defaultDbName, { auto_compaction: true });
  }

  getDocId(name: string, id: string): string {
    return name + '/' + id;
  }

  replaceDocId(name: string, id: string): string {
    return id.replace(name + '/', '');
  }

  errorInfo(name: string, message: string): DBError {
    return { error: true, name, message };
  }

  private checkDocSize(doc: Doc<any>) {
    if (Buffer.byteLength(JSON.stringify(doc)) > this.docMaxByteLength) {
      return this.errorInfo(
        'exception',
        `doc max size ${this.docMaxByteLength / 1024 / 1024} M`
      );
    }
    return false;
  }

  async put(
    name: string,
    doc: Doc<any>,
    strict = true
  ): Promise<DBError | DocRes> {
    if (strict) {
      const err = this.checkDocSize(doc);
      if (err) return err;
    }
    doc._id = this.getDocId(name, doc._id);
    try {
      const result: DocRes = await this.pouchDB.put(doc);
      doc._id = result.id = this.replaceDocId(name, result.id);
      return result;
    } catch (e: any) {
      doc._id = this.replaceDocId(name, doc._id);
      return { id: doc._id, name: e.name, error: !0, message: e.message };
    }
  }

  async get(name: string, id: string): Promise<DocRes | null> {
    try {
      const result: DocRes = await this.pouchDB.get(this.getDocId(name, id));
      result._id = this.replaceDocId(name, result._id);
      return result;
    } catch (e) {
      return null;
    }
  }

  async remove(name: string, doc: Doc<any> | string) {
    try {
      let target;
      if ('object' == typeof doc) {
        target = doc;
        if (!target._id || 'string' !== typeof target._id) {
          return this.errorInfo('exception', 'doc _id error');
        }
        target._id = this.getDocId(name, target._id);
      } else {
        if ('string' !== typeof doc) {
          return this.errorInfo('exception', 'param error');
        }
        target = await this.pouchDB.get(this.getDocId(name, doc));
      }
      const result: DocRes = await this.pouchDB.remove(target);
      target._id = result.id = this.replaceDocId(name, result.id);
      return result;
    } catch (e: any) {
      if ('object' === typeof doc) {
        doc._id = this.replaceDocId(name, doc._id);
      }
      return this.errorInfo(e.name, e.message);
    }
  }

  async bulkDocs(
    name: string,
    docs: Array<Doc<any>>
  ): Promise<DBError | Array<DocRes>> {
    let result;
    try {
      if (!Array.isArray(docs)) return this.errorInfo('exception', 'not array');
      if (docs.find((e) => !e._id))
        return this.errorInfo('exception', 'doc not _id field');
      if (new Set(docs.map((e) => e._id)).size !== docs.length)
        return this.errorInfo('exception', '_id value exists as');
      for (const doc of docs) {
        const err = this.checkDocSize(doc);
        if (err) return err;
        doc._id = this.getDocId(name, doc._id);
      }
      result = await this.pouchDB.bulkDocs(docs);
      result = result.map((res: any) => {
        res.id = this.replaceDocId(name, res.id);
        return res.error
          ? {
              id: res.id,
              name: res.name,
              error: true,
              message: res.message,
            }
          : res;
      });
      docs.forEach((doc) => {
        doc._id = this.replaceDocId(name, doc._id);
      });
    } catch (e) {
      //
    }
    return result;
  }

  async allDocs(
    name: string,
    key: string | Array<string>
  ): Promise<DBError | Array<DocRes>> {
    const config: any = { include_docs: true };
    if (key) {
      if ('string' == typeof key) {
        config.startkey = this.getDocId(name, key);
        config.endkey = config.startkey + '￰';
      } else {
        if (!Array.isArray(key))
          return this.errorInfo(
            'exception',
            'param only key(string) or keys(Array[string])'
          );
        config.keys = key.map((key) => this.getDocId(name, key));
      }
    } else {
      config.startkey = this.getDocId(name, '');
      config.endkey = config.startkey + '￰';
    }
    const result: Array<any> = [];
    try {
      (await this.pouchDB.allDocs(config)).rows.forEach((res: any) => {
        if (!res.error && res.doc) {
          res.doc._id = this.replaceDocId(name, res.doc._id);
          result.push(res.doc);
        }
      });
    } catch (e) {
      //
    }
    return result;
  }

  public async dumpDb(config: {
    url: string;
    username: string;
    password: string;
  }): Promise<void> {
    const webdavClient = new WebDavOP(config);
    webdavClient.createWriteStream(this.pouchDB);
  }

  public async importDb(config: {
    url: string;
    username: string;
    password: string;
  }): Promise<void> {
    const webdavClient = new WebDavOP(config);
    await this.pouchDB.destroy();
    const syncDb = new DB(this.dbpath);
    syncDb.init();
    this.pouchDB = syncDb.pouchDB;
    await webdavClient.createReadStream(this.pouchDB);
  }

  public async postAttachment(
    name: string,
    docId: string,
    attachment: Buffer | Uint8Array,
    type: string
  ) {
    const buffer = Buffer.from(attachment);
    if (buffer.byteLength > this.docAttachmentMaxByteLength)
      return this.errorInfo(
        'exception',
        'attachment data up to ' +
          this.docAttachmentMaxByteLength / 1024 / 1024 +
          'M'
      );
    try {
      const result = await this.pouchDB.put({
        _id: this.getDocId(name, docId),
        _attachments: { 0: { data: buffer, content_type: type } },
      });
      result.id = this.replaceDocId(name, result.id);
      return result;
    } catch (e) {
      return this.errorInfo(e.name, e.message);
    }
  }

  async getAttachment(name: string, docId: string, len = '0') {
    try {
      return await this.pouchDB.getAttachment(this.getDocId(name, docId), len);
    } catch (e) {
      return null;
    }
  }
}
