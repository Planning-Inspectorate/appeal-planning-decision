const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const { rules } = require('../../../src/validators/other-appeals');

describe('validators/other-appeals', () => {
  describe('rules', () => {
    it('has a rule for the adjacent appeal', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['adjacent-appeals']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual(
        'Select yes if there are other appeals still being considered'
      );

      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options[0]).toEqual(['yes', 'no']);
    });

    it('has a rule for the appeal reference number(s)', () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['appeal-reference-numbers']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].chain).toHaveProperty('if');
      expect(rule.stack[0].chain.builder.fields).toEqual(['adjacent-appeals']);
      expect(rule.stack[0].chain.builder.locations).toEqual(['body']);

      expect(rule.stack[1].validator.name).toEqual('isEmpty');
      expect(rule.stack[1].negated).toBeTruthy();
      expect(rule.stack[1].message).toEqual('Enter appeal reference number(s)');
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
            'Select yes if there are other appeals still being considered'
          );
          expect(result.errors[0].param).toEqual('adjacent-appeals');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid (yes selected, no numbers passed) - fail',
        given: () => ({
          body: {
            'adjacent-appeals': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Enter appeal reference number(s)');
          expect(result.errors[0].param).toEqual('appeal-reference-numbers');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'valid values (no selected) - pass',
        given: () => ({
          body: {
            'adjacent-appeals': 'no',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid values (yes selected and number given) - pass',
        given: () => ({
          body: {
            'adjacent-appeals': 'yes',
            'appeal-reference-numbers': 'some-ref',
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
