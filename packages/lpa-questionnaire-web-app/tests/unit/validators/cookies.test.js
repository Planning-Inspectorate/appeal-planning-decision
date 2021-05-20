const { validationResult } = require('express-validator');
const { rules, validUsageCookieOptions } = require('../../../src/validators/cookies');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');

describe('validators/cookies', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(1);
    });

    describe('ruleUsageCookie', () => {
      it('is configured with the expected rules', () => {
        const rule = rules()[0].builder.build();

        expect(rule.fields).toEqual(['usage-cookies']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(2);
        expect(rule.message).toBeUndefined();
      });
    });
  });

  describe('validator', () => {
    [
      {
        title: 'No selection made as to cookie usage - valid, not a required field',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'Invalid - value provided but not an allowable value',
        given: () => ({
          body: {
            'usage-cookies': 'bad value',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title: 'Usage cookie is agreed',
        given: () => ({
          body: {
            'usage-cookies': 'on',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'Usage cookie is not agreed',
        given: () => ({
          body: {
            'usage-cookies': 'off',
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

  describe('validUsageCookieOptions', () => {
    it('should define the expected valid usage cookie options', () => {
      expect(validUsageCookieOptions).toEqual(['on', 'off']);
    });
  });
});
