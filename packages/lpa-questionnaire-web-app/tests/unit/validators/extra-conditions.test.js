const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const { rules } = require('../../../src/validators/extra-conditions');

describe('validators/extra-conditions', () => {
  describe('rules', () => {
    it('has a rule for the extra conditions', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['has-extra-conditions']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual('Select yes if you have extra conditions');

      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options[0]).toEqual(['yes', 'no']);
    });

    it('has a rule for the extra conditions text', () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['extra-conditions-text']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].chain).toHaveProperty('if');
      expect(rule.stack[0].chain.builder.fields).toEqual(['has-extra-conditions']);
      expect(rule.stack[0].chain.builder.locations).toEqual(['body']);

      expect(rule.stack[1].validator.name).toEqual('isEmpty');
      expect(rule.stack[1].negated).toBeTruthy();
      expect(rule.stack[1].message).toEqual('What are the extra conditions?');
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
          expect(result.errors[0].msg).toEqual('Select yes if you have extra conditions');
          expect(result.errors[0].param).toEqual('has-extra-conditions');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid (yes selected, no text passed) - fail',
        given: () => ({
          body: {
            'has-extra-conditions': 'yes',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('What are the extra conditions?');
          expect(result.errors[0].param).toEqual('extra-conditions-text');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'valid (no selected) - pass',
        given: () => ({
          body: {
            'has-extra-conditions': 'no',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid (yes selected and text passed) - pass',
        given: () => ({
          body: {
            'has-extra-conditions': 'yes',
            'extra-conditions-text': 'some-ref',
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
