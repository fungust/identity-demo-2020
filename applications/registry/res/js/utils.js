
function verifySignature(publicKeySPKIB64, data, signatureB64) {
  return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
      "spki",
      base64ToArrayBuffer(publicKeySPKIB64),
      {
        name: "RSA-PSS",
        hash: { name: "SHA-512" },
      },
      false,
      ["verify"]
    )
      .then((publicKey) => {
        sha512(data)
          .then((hashed) => {
            window.crypto.subtle.verify(
              {
                name: "RSA-PSS",
                saltLength: 128, //the length of the salt
              },
              publicKey,
              base64ToArrayBuffer(signatureB64),
              stringToArrayBuffer(hashed)
            )
              .then((isValid) => {
                if (isValid) {
                  resolve()
                } else {
                  reject('invalid');
                };
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function importKeyFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function () {
      try {
        keyData = JSON.parse(reader.result);
      } catch (e) {
        reject('Error parsing file contents');
      };
      window.crypto.subtle.importKey(
        "pkcs8",
        base64ToArrayBuffer(keyData.private),
        {
          name: "RSA-PSS",
          hash: { name: "SHA-512" },
        },
        false,
        ["sign"]
      )
        .then((privateKey) => {
          resolve({
            privateKey,
            keyData
          });
        })
        .catch((err) => {
          reject(err);
        });
    };
    reader.readAsText(file);
  })
}

function signHashed(privateKey, data) {
  return new Promise((resolve, reject) => {
    sha512(data)
      .then((hashed) => {
        window.crypto.subtle.sign(
          {
            name: "RSA-PSS",
            saltLength: 128,
          },
          privateKey,
          stringToArrayBuffer(hashed)
        )
          .then((signature) => {
            resolve(arrayBufferToBase64(signature))
          })
          .catch((err) => {
            reject(err)
          });
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function exportKey(key, mode) {
  switch (mode) {
    case 'private':
      return new Promise((resolve, reject) => {
        window.crypto.subtle.exportKey(
          "pkcs8",
          key.privateKey
        )
          .then((keydata) => {
            resolve(arrayBufferToBase64(keydata));
          })
          .catch((err) => {
            reject(err);
          });
      });
      break;
    case 'public':
      return new Promise((resolve, reject) => {
        window.crypto.subtle.exportKey(
          "spki",
          key.publicKey
        )
          .then((keydata) => {
            resolve(arrayBufferToBase64(keydata));
          })
          .catch((err) => {
            reject(err);
          });
      });
      break;
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function stringToArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  };
  return buf;
}

function sha512(str) {
  return new Promise((resolve, reject) => {
    crypto.subtle.digest(
      "SHA-512",
      new TextEncoder("utf-8").encode(str)
    )
      .then((buf) => {
        let result = Array.prototype.map.call(new Uint8Array(buf), (x) => (('00' + x.toString(16)).slice(-2))).join('');
        resolve(result)
      })
      .catch((err) => {
        reject(err);
      });
  })
}

function sha256(str) {
  return new Promise((resolve, reject) => {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder("utf-8").encode(str)
    )
      .then((buf) => {
        let result = Array.prototype.map.call(new Uint8Array(buf), (x) => (('00' + x.toString(16)).slice(-2))).join('');
        resolve(result)
      })
      .catch((err) => {
        reject(err);
      });
  })
}