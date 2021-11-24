const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/before-you-start/any-of-following');

describe('validators/before-you-start/any-of-following', () => {
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
  });

  describe('validator', () => {
    [
      {
        title: 'undefined - empty',
        given: () => ({
          body: {
            option: undefined,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].param).toEqual('does-not-include-sensitive-information');
          expect(result.errors[0].value).toEqual(undefined);
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
