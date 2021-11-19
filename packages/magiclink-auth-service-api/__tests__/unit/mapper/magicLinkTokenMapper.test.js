jest.mock('../../../src/util/crypto');
const magicLinkTokenMapper = require('../../../src/mappers/magicLinkTokenMapper');
const cryptoUtils = require('../../../src/util/crypto');
const magicLinkData = require('../../resources/magicLinkData.json');

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
      cryptoUtils.encrypt.mockReturnValue('magicLinkDataEncrypted');

      const tokenPayload = magicLinkTokenMapper.magicLinkDataToToken(magicLinkData);

      const expectedTokenPayload = {
        data: 'magicLinkDataEncrypted',
        exp: 1630200347,
      };
      expect(tokenPayload).toEqual(expectedTokenPayload);
    });
  });

  describe('tokenToMagicLinkData', () => {
    it('should returned the decrypted data attribute from the token payload', () => {
      cryptoUtils.decrypt.mockReturnValue(JSON.stringify(magicLinkData));

      const tokenPayload = {
        data: 'magicLinkDataEncrypted',
        exp: 1630200347,
      };
      const magicLinkDataObject = magicLinkTokenMapper.tokenToMagicLinkData(tokenPayload);

      expect(magicLinkDataObject).toEqual(magicLinkData);
    });
  });
});
