jest.mock('../../../src/util/crypto');
const magicLinkTokenMapper = require('../../../src/mappers/magicLinkTokenMapper');
const mockCryptoUtils = require('../../../src/util/crypto');
const mockMagicLinkData = require('../../resources/magicLinkData.json');

describe('mapper.magicLinkTokenMapper', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(1629300347);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('magicLinkDataToToken', () => {
    it('should create the token payload that has the encrypted magicLinkData as payload', () => {
      mockCryptoUtils.encrypt.mockReturnValue('mockEncryptedData');

      const tokenPayload = magicLinkTokenMapper.magicLinkDataToToken(mockMagicLinkData);

      expect(tokenPayload).toEqual({
        data: 'mockEncryptedData',
        exp: 1630200347,
      });
    });
  });

  describe('tokenToMagicLinkData', () => {
    it('should returned the decrypted data attribute from the token payload', () => {
      mockCryptoUtils.decrypt.mockReturnValue(JSON.stringify(mockMagicLinkData));

      const magicLinkData = magicLinkTokenMapper.tokenToMagicLinkData({
        data: 'mockEncryptedData',
        exp: 1630200347,
      });

      expect(magicLinkData).toEqual(mockMagicLinkData);
    });
  });
});
