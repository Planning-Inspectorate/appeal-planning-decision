const crypto = require('crypto');
const config = require('../config');
const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);
const secretKey = config.dataEncryptionKey;

/**
 * Encrypts text using aes-256-ctr algorithm.
 *
 * @param text
 * @returns {{iv: string, content: string}}
 */
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

/**
 * Decrypts hash that was encrypted using aes-256-ctr algorithm.
 *
 * @param hash
 * @returns {string}
 */
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

module.exports = {
  decrypt,
  encrypt,
};
