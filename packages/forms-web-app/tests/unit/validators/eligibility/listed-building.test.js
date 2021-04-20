const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const {
  rules,
  validIsListedBuildingOptions,
} = require('../../../../src/validators/eligibility/listed-building');

describe('validators/eligibility/listed-building', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['is-your-appeal-about-a-listed-building']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);
      expect(rule.stack[0].message).toEqual('Select yes if your appeal is about a listed building');
      expect(rule.stack[2].options).toEqual([['yes', 'no']]);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined - empty',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Select yes if your appeal is about a listed building'
          );
          expect(result.errors[0].param).toEqual('is-your-appeal-about-a-listed-building');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid value - fail',
        given: () => ({
          body: {
            'is-your-appeal-about-a-listed-building': 12,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Invalid value');
          expect(result.errors[0].param).toEqual('is-your-appeal-about-a-listed-building');
          expect(result.errors[0].value).toEqual(12);
        },
      },
      {
        title: 'valid value - "yes" - pass',
        given: () => ({
          body: {
            'is-your-appeal-about-a-listed-building': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid value - "no" - pass',
        given: () => ({
          body: {
            'is-your-appeal-about-a-listed-building': 'no',
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

  describe('validIsListedBuildingOptions', () => {
    it('should define the expected valid listed building options', () => {
      expect(validIsListedBuildingOptions).toEqual(['yes', 'no']);
    });
  });
});
