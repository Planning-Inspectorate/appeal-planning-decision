const { validationResult } = require('express-validator');
const {
  rules,
  validHouseholderPlanningPermissionOptions,
} = require('../../../../src/validators/eligibility/householder-planning-permission');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/eligibility/householder-planning-permission`', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(1);
    });

    describe('ruleHouseholderPlanningPermission', () => {
      it('is configured with the expected rules', () => {
        const rule = rules()[0].builder.build();

        expect(rule.fields).toEqual(['householder-planning-permission']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].negated).toBeTruthy();
        expect(rule.stack[0].validator.name).toEqual('isEmpty');
        expect(rule.stack[0].message).toEqual(
          'Select Yes if you applied for householder planning permission'
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
        title: 'No selection made on the householder planning permission question',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Select Yes if you applied for householder planning permission'
          );
          expect(result.errors[0].param).toEqual('householder-planning-permission');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'User selected `yes` on the householder planning permission question',
        given: () => ({
          body: {
            'householder-planning-permission': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'User selected `no` on the householder planning permission question',
        given: () => ({
          body: {
            'householder-planning-permission': 'no',
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

  describe('validHouseholderPlanningPermissionOptions', () => {
    it('should define the expected valid householder planning permission options', () => {
      expect(validHouseholderPlanningPermissionOptions).toEqual(['yes', 'no']);
    });
  });
});
