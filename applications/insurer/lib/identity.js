const crypto = require('crypto');


// class that implements signing and verifying for public keys
class Identity {
  constructor({ identity = null }) {
    this._identity = identity;

    if (identity) {
      this.public = identity.public;
      this._public = crypto.createPublicKey({
        key: Buffer.from(identity.public, 'base64'),
        format: 'der',
        type: 'spki'
      });

      this._private = crypto.createPrivateKey({
        key: Buffer.from(identity.private, 'base64'),
        format: 'der',
        type: 'pkcs8'
      });

      this._private.padding = crypto.constants.RSA_PKCS1_PSS_PADDING;
      this._private.saltLength = 128
    }
  }

  sign(data) {
    if (!this._identity) { return }
    let hash = crypto.createHash('sha512').update(data).digest('hex');
    return (crypto.sign(
      'RSA-SHA512',
      Buffer.from(hash),
      this._private
    )).toString('base64');
  }

  verify({ publicKey, data, signature }) {
    publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKey, 'base64'),
      format: 'der',
      type: 'spki'
    });
    publicKey.padding = crypto.constants.RSA_PKCS1_PSS_PADDING;
    publicKey.saltLength = 128;
    let hash = crypto.createHash('sha512').update(data).digest('hex');
    return crypto.verify(
      'RSA-SHA512',
      Buffer.from(hash),
      publicKey,
      Buffer.from(signature, 'base64')
    )
  }
}

module.exports = Identity;