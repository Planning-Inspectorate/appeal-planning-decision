const crypto = require('../../../src/util/crypto');

const mockData = JSON.stringify({
  attribute: 'value',
});

const mockEncryptedData = {
  content: 'fb07c8062a2ec2175d58b9946f793a6f3887290a80',
  iv: 'ffa5698984618699479f1a592a039e46',
};

describe('util.crypto', () => {
  describe('encrypt text', () => {
    test('should encrypt with success', () => {
      const encryptedData = crypto.encrypt(mockData);

      expect(encryptedData).toHaveProperty('content');
      expect(encryptedData).toHaveProperty('iv');
    });
  });

  describe('decrypt text', () => {
    test('should decrypt with success', () => {
      const encryptedData = crypto.decrypt(mockEncryptedData);

      expect(encryptedData).toEqual(mockData);
    });
  });
});
