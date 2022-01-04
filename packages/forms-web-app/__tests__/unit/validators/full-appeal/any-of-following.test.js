const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/full-appeal/any-of-following');

describe('validators/full-appeal/any-of-following', () => {
  describe('rules', () => {
    it('has a rule for `option`', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['option']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined - error',
        given: () => ({
          body: {
            option: undefined,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].param).toEqual('option');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'defined - no error',
        given: () => ({
          body: {
            option: 'none_of_above',
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
