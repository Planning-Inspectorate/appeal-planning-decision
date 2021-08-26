const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/appellant-submission/appeal-statement');
const { MIME_TYPE_JPEG } = require('../../../../src/lib/mime-types');
const config = require('../../../../src/config');

describe('validators/appellant-submission/appeal-statement', () => {
  const sessionWithAppealSubmitted = {
    appeal: { yourAppealSection: { appealStatement: { uploadedFile: { id: 'appeal.pdf' } } } },
  };

  const sessionWithNoAppealSubmitted = {
    appeal: { yourAppealSection: { appealStatement: { uploadedFile: { id: null } } } },
  };

  describe('rules', () => {
    it('has a rule for `does-not-include-sensitive-information`', () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['does-not-include-sensitive-information']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);
      expect(rule.stack[0].message).toEqual(
        'Select to confirm you have not included sensitive information'
      );
      expect(rule.stack[2].validator.name).toEqual('equals');
      expect(rule.stack[2].options).toEqual(['i-confirm']);
    });

    it('has a rule for `appeal-upload`', () => {
      const rule = rules()[0][0].builder.build();

      expect(rule.fields).toEqual(['appeal-upload']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.name).toEqual('options');
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('should have the expected number of configured rules', () => {
      expect(rules().length).toEqual(2);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined - empty',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Select to confirm you have not included sensitive information'
          );
          expect(result.errors[0].param).toEqual('does-not-include-sensitive-information');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid value for `does-not-include-sensitive-information` - fail',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 12,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Invalid value');
          expect(result.errors[0].param).toEqual('does-not-include-sensitive-information');
          expect(result.errors[0].value).toEqual(12);
        },
      },
      {
        title: 'valid value for `does-not-include-sensitive-information` - "i-confirm" - pass',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title:
          'valid value for `does-not-include-sensitive-information`, files key is empty - pass',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'a',
          },
          files: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title:
          'valid value for `does-not-include-sensitive-information`, files path is not matched - pass',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'a',
          },
          files: { x: {} },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title:
          'valid value for `does-not-include-sensitive-information`, files path is matched but mime type is wrong - fail',
        given: () => ({
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'x',
          },
          files: {
            'appeal-upload': {
              mimetype: 'bad',
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title:
          'valid value for `does-not-include-sensitive-information`, files path is matched but file size is too big - fail',
        given: () => ({
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'x',
          },
          files: {
            'appeal-upload': {
              mimetype: MIME_TYPE_JPEG,
              size: config.fileUpload.pins.appealStatementMaxFileSize + 1,
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title:
          'valid value for `does-not-include-sensitive-information`, no file, never submitted - fail',
        given: () => ({
          session: sessionWithNoAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'x',
          },
          files: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Select an appeal statement');
        },
      },
      {
        title: 'valid value for `does-not-include-sensitive-information`, valid file - pass',
        given: () => ({
          session: sessionWithAppealSubmitted,
          body: {
            'does-not-include-sensitive-information': 'i-confirm',
            'appeal-upload': 'x',
          },
          files: {
            'appeal-upload': {
              mimetype: MIME_TYPE_JPEG,
              size: config.fileUpload.maxFileSizeBytes - 1,
            },
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, rules());
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
