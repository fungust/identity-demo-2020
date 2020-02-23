const MongoClient = require('mongodb').MongoClient;

const crypto = require('crypto')

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
          reject(err);
        } else {
          this.db = this.client.db('registry');
          this.db.collection('otp').createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 })
          this.db.collection('otp').createIndex({ "otp": "hashed" });
          this.db.collection('entities').createIndex({ "name": 1 }, { unique: true })
          this.db.collection('entities').createIndex({ "name": "hashed" })
          this.db.collection('ephemeral').createIndex({ "createdAt": 1 }, { expireAfterSeconds: 30 * 24 * 3600 })
          this.db.collection('ephemeral').createIndex({ "id": 1 }, { unique: true })
          this.db.collection('ephemeral').createIndex({ "id": "hashed" })
          resolve();
        };
      });
    })
  }

  newOTP() {
    let nonce = `${Date.now()}${Math.round(Math.random() * 1000000)}`;
    let otp = (crypto.createHash('sha256').update(nonce).digest()).toString('base64');
    return new Promise((resolve, reject) => {
      this.db.collection('otp').insertOne(
        {
          createdAt: new Date(),
          otp
        },
        (err) => {
          if (err) {
            reject(err.errmsg);
          } else {
            resolve(otp);
          };
        }
      );
    })
  }

  registerNewEntity({ otp, name, identity }) {
    return new Promise((resolve, reject) => {
      this.db.collection('otp').findOneAndDelete(
        { otp },
        (err, doc) => {
          if (err) {
            reject(err);
          } else {
            if (doc.lastErrorObject.n == 1) {
              this.db.collection('entities').insertOne(
                {
                  name,
                  identity,
                  createdAt: new Date()
                },
                (err) => {
                  if (err) {
                    resolve('Entity name exists');
                  } else {
                    resolve('Registration Successful');
                  };
                });
            } else {
              resolve('OTP invalid');
            };
          };
        }
      );
    })
  }

  findEntity({ name }) {
    return new Promise((resolve, reject) => {
      this.db.collection('entities').findOne(
        { name },
        (err, doc) => {
          if (err) {
            reject(err.errmsg);
          } else {
            if (doc) {
              resolve(doc.identity);
            } else {
              resolve('Not found');
            };
          };
        });
    })
  }

  registerEphemeral({ id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('ephemeral').insertOne(
        {
          id,
          createdAt: new Date()
        },
        (err) => {
          if (err) {
            reject(err.errmsg);
          } else {
            resolve(id);
          };
        });
    })
  }

  findEphemeral({ id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('ephemeral').findOne(
        { id },
        (err, doc) => {
          if (err) {
            reject(err.errmsg);
          } else {
            if (doc) {
              resolve(true);
            } else {
              resolve(false);
            };
          };
        });
    })
  }
}

module.exports = MongoFacade;