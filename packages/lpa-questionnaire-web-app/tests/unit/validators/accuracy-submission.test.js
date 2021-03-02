const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const { rules } = require('../../../src/validators/accuracy-submission');

describe('validators/accuracy-submission', () => {
  describe('rules', () => {
    it('has a rule for the accurate submission', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['accurate-submission']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual(
        'Select yes if the information accurately reflects the planning application'
      );

      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options[0]).toEqual(['yes', 'no']);
    });

    it('has a rule for inaccuracy reason', () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['inaccuracy-reason']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].chain).toHaveProperty('if');
      expect(rule.stack[0].chain.builder.fields).toEqual(['accurate-submission']);
      expect(rule.stack[0].chain.builder.locations).toEqual(['body']);

      expect(rule.stack[1].validator.name).toEqual('isEmpty');
      expect(rule.stack[1].negated).toBeTruthy();
      expect(rule.stack[1].message).toEqual(
        'Enter details of why this does not accurately reflect the planning application'
      );
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
            'Select yes if the information accurately reflects the planning application'
          );
          expect(result.errors[0].param).toEqual('accurate-submission');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid (no selected, no reason passed) - fail',
        given: () => ({
          body: {
            'accurate-submission': 'no',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Enter details of why this does not accurately reflect the planning application'
          );
          expect(result.errors[0].param).toEqual('inaccuracy-reason');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'valid values (yes selected) - pass',
        given: () => ({
          body: {
            'accurate-submission': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid values (no selected and reason given) - pass',
        given: () => ({
          body: {
            'accurate-submission': 'no',
            'inaccuracy-reason': 'mock reason',
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
