const magicLinkDataValidator = require('../../../../src/validators/schema/magiclinkDataValidator');
const magicLinkData = require('../../../resources/magicLinkData.json');

describe('validators.schema.magicLinkDataValidator', () => {
  let magicLinkDataObject;

  beforeEach(() => {
    magicLinkDataObject = JSON.parse(JSON.stringify(magicLinkData));
  });

  describe('with valid schema magicLinkData object', () => {
    test('should return the magicLinkData object', async () => {
      const response = await magicLinkDataValidator.validate(magicLinkDataObject);

      expect(response).toEqual(magicLinkDataObject);
    });
  });

  describe('with missing required attributes', () => {
    test('should throw error', async () => {
      delete magicLinkDataObject.magicLink.redirectURL;
      delete magicLinkDataObject.auth;

      try {
        await magicLinkDataValidator.validate(magicLinkDataObject);
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
      magicLinkDataObject.magicLink.destinationEmail = 'invalidEmailAddress';

      try {
        await magicLinkDataValidator.validate(magicLinkDataObject);
      } catch (result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toEqual(
          expect.arrayContaining(['magicLink.destinationEmail must be a valid email']),
        );
      }
    });
  });
});
