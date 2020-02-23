const MongoClient = require('mongodb').MongoClient;
const common = require('./common.js');
const log = new common.logger('db.js');

class MongoFacade {
  constructor(url) {
    this.url = url;
    this.client = new MongoClient(url);
    this.db = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      this.client.connect((err) => {
        if (err) {
          reject(err.errmsg);
        } else {
          this.db = this.client.db('repository_hos');
          log.status('db', `Connected to ${this.url}`)
          resolve();
        };
      });
    })
  }

  writeKey(key) {
    return new Promise((resolve, reject) => {
      this.db.collection('keys').insertOne(
        key,
        (err) => {
          if (err) {
            reject(err.errmsg);
          } else {
            resolve();
          };
        });
    });
  }

  readKey() {
    return new Promise((resolve, reject) => {
      this.db.collection('keys').findOne(
        {},
        (err, doc) => {
          if (err) {
            reject(err.errmsg);
          } else {
            resolve(doc);
          };
        });
    });
  }
}

module.exports = MongoFacade;