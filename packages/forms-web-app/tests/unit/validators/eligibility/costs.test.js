const { validationResult } = require('express-validator');
const { rules, validCostsOptions } = require('../../../../src/validators/eligibility/costs');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

jest.mock('../../../../src/services/department.service');

describe('validators/eligibility/costs', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(1);
    });

    describe('ruleCosts', () => {
      it('is configured with the expected rules', () => {
        const rule = rules()[0].builder.build();

        expect(rule.fields).toEqual(['claim-costs']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].negated).toBeTruthy();
        expect(rule.stack[0].validator.name).toEqual('isEmpty');
        expect(rule.stack[0].message).toEqual(
          'Select yes if you are claiming for costs as part of your appeal'
        );

        expect(rule.stack[2].negated).toBeFalsy();
        expect(rule.stack[2].validator.name).toEqual('isIn');
        expect(rule.stack[2].options).toEqual([['yes', 'no']]);
      });
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
            'Select yes if you are claiming for costs as part of your appeal'
          );
          expect(result.errors[0].param).toEqual('claim-costs');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid value for `claim-costs` - fail',
        given: () => ({
          body: {
            'claim-costs': 12,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Invalid value');
          expect(result.errors[0].param).toEqual('claim-costs');
          expect(result.errors[0].value).toEqual(12);
        },
      },
      {
        title: 'valid value for `claim-costs` - "yes" - pass',
        given: () => ({
          body: {
            'claim-costs': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid value for `claim-costs` - "no" - pass',
        given: () => ({
          body: {
            'claim-costs': 'no',
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

  describe('validClaimCostsOptions', () => {
    it('should define the expected valid claim costs options', () => {
      expect(validCostsOptions).toEqual(['yes', 'no']);
    });
  });
});
