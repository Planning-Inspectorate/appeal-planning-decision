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
      mockCryptoUtils.encrypt.mockReturnValue('magicLinkDataEncrypted');

      const tokenPayload = magicLinkTokenMapper.magicLinkDataToToken(mockMagicLinkData);

      const expectedTokenPayload = {
        data: 'magicLinkDataEncrypted',
        exp: 1630200347,
      };
      expect(tokenPayload).toEqual(expectedTokenPayload);
    });
  });

  describe('tokenToMagicLinkData', () => {
    it('should returned the decrypted data attribute from the token payload', () => {
      mockCryptoUtils.decrypt.mockReturnValue(JSON.stringify(mockMagicLinkData));

      const tokenPayload = {
        data: 'mockMagicLinkDataEncrypted',
        exp: 1630200347,
      };
      const magicLinkData = magicLinkTokenMapper.tokenToMagicLinkData(tokenPayload);

      expect(magicLinkData).toEqual(mockMagicLinkData);
    });
  });
});
