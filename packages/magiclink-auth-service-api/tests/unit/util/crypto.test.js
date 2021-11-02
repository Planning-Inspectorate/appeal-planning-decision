const crypto = require('../../../src/util/crypto');

const data = JSON.stringify({
  attribute: 'value',
});

const encryptedData = {
  content: 'fb07c8062a2ec2175d58b9946f793a6f3887290a80',
  iv: 'ffa5698984618699479f1a592a039e46',
};

describe('util.crypto', () => {
  describe('encrypt text', () => {
    test('should encrypt with success', () => {
      const expectedEncryptedData = crypto.encrypt(data);

      expect(expectedEncryptedData).toHaveProperty('content');
      expect(expectedEncryptedData).toHaveProperty('iv');
    });
  });

  describe('decrypt text', () => {
    test('should decrypt with success', () => {
      const expectedEncryptedData = crypto.decrypt(encryptedData);

      expect(expectedEncryptedData).toEqual(data);
    });
  });
});
