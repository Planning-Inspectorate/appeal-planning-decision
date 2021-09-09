jest.mock('../../../src/mappers/magicLinkTokenMapper');
jest.mock('../../../src/util/jwt');
jest.mock('../../../src/util/logger');
const createMagicLink = require('../../../src/interactors/createMagicLink');

const mockMapper = require('../../../src/mappers/magicLinkTokenMapper');
const mockJWTUtil = require('../../../src/util/jwt');
const mockLogger = require('../../../src/util/logger');
const mockMagicLinkData = require('../../resources/magicLinkData.json');

describe('interactors.createMagicLink', () => {
  describe('create magic link', () => {
    it('should return the magic link url', () => {
      mockMapper.magicLinkDataToToken.mockReturnValue({
        data: 'mockEncryptedData',
        exp: 1630200347,
      });
      mockJWTUtil.sign.mockReturnValue('mockJWT');

      const magicLink = createMagicLink('https://localhost:3009', mockMagicLinkData);

      expect(magicLink).toEqual('https://localhost:3009/magiclink/mockJWT');
    });
  });

  describe('create magic link with error from one of the utils', () => {
    it('should log error and throw a new one', () => {
      mockJWTUtil.sign.mockImplementation(() => {
        throw new Error('missing signing key');
      });

      try {
        createMagicLink('https://localhost:3009', mockMagicLinkData);
      } catch (err) {
        expect(mockLogger.error).toHaveBeenCalled();
        expect(err.message).toEqual('An error occurred while trying to create magic link token');
      }
    });
  });
});
