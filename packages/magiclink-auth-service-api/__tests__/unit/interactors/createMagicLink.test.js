jest.mock('../../../src/mappers/magicLinkTokenMapper');
jest.mock('../../../src/util/jwt');
jest.mock('../../../src/util/logger');
const createMagicLink = require('../../../src/interactors/createMagicLink');

const mapper = require('../../../src/mappers/magicLinkTokenMapper');
const jwtUtil = require('../../../src/util/jwt');
const logger = require('../../../src/util/logger');
const magicLinkData = require('../../resources/magicLinkData.json');

describe('interactors.createMagicLink', () => {
  describe('create magic link', () => {
    it('should return the magic link url', () => {
      mapper.magicLinkDataToToken.mockReturnValue({
        data: 'mockEncryptedData',
        exp: 1630200347,
      });
      jwtUtil.sign.mockReturnValue('mockJWT');

      const magicLink = createMagicLink('https://localhost:3009', magicLinkData);

      expect(magicLink).toEqual('https://localhost:3009/magiclink/mockJWT');
    });
  });

  describe('create magic link with error from one of the utils', () => {
    it('should log error and throw a new one', () => {
      jwtUtil.sign.mockImplementation(() => {
        throw new Error('missing signing key');
      });

      try {
        createMagicLink('https://localhost:3009', magicLinkData);
      } catch (err) {
        expect(logger.error).toHaveBeenCalled();
        expect(err.message).toEqual('An error occurred while trying to create magic link token');
      }
    });
  });
});
