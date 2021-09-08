const magicLinkDataValidator = require('../../../../src/validators/schema/magiclinkDataValidator');
const mockMagicLinkData = require('../../../resources/magicLinkData.json');

describe('validators.schema.magicLinkDataValidator', () => {
  let magicLinkData;

  beforeEach(() => {
    magicLinkData = JSON.parse(JSON.stringify(mockMagicLinkData));
  });

  describe('with valid schema magicLinkData object', () => {
    test('should return the magicLinkData object', async () => {
      const response = await magicLinkDataValidator.validate(magicLinkData);

      expect(response).toEqual(magicLinkData);
    });
  });

  describe('with missing required attributes', () => {
    test('should throw error', async () => {
      delete magicLinkData.magicLink.redirectURL;
      delete magicLinkData.auth;

      try {
        await magicLinkDataValidator.validate(magicLinkData);
      } catch (result) {
        expect(result.errors.length).toEqual(4);
        expect(result.errors).toEqual(
          expect.arrayContaining([
            'magicLink.redirectURL is a required field',
            'auth.cookieName is a required field',
            'auth.userInformation is a required field',
            'auth.tokenValidity is a required field',
          ]),
        );
      }
    });
  });

  describe('with invalid email address format', () => {
    test('should throw error', async () => {
      magicLinkData.magicLink.destinationEmail = 'invalidEmailAddress';

      try {
        await magicLinkDataValidator.validate(magicLinkData);
      } catch (result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toEqual(
          expect.arrayContaining(['magicLink.destinationEmail must be a valid email']),
        );
      }
    });
  });
});
