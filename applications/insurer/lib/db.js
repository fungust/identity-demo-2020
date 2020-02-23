const MongoClient = require('mongodb').MongoClient;

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
          this.db = this.client.db('repository_ins');
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