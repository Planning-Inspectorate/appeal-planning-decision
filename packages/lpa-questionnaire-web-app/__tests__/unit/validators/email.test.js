const { validationResult } = require('express-validator');
const { rules } = require('../../../src/validators/email');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');

describe('validators/email', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(1);
    });
  });

  describe('ruleYourEmail', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['email']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(5);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual(
        'Enter an email address in the correct format, like name@example.com'
      );

      expect(rule.stack[2].validator.name).toEqual('isEmail');
      expect(rule.stack[2].message).toEqual(
        'Enter an email address in the correct format, like name@example.com'
      );

      expect(rule.stack[4].validator.name).toEqual('matches');
      expect(rule.stack[4].options[0]).toEqual(
        /^(?=[\w\s])\s*[-+.'\w]*['\w]+@[-.\w]+\.[-.\w]+\s*$/
      );
      expect(rule.stack[4].message).toEqual(
        'Enter an email address in the correct format, like name@example.com'
      );
    });
  });

  describe('validator', () => {
    [
      {
        title: 'Email is not provided by the LPA Officer',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[0].param).toEqual('email');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'LPA Officer has entered some text that does not match valid email format',
        given: () => ({
          body: {
            email: 'EmailWithoutDomain',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[0].param).toEqual('email');
          expect(result.errors[0].value).toEqual('EmailWithoutDomain');
        },
      },
      {
        title: 'LPA Officer has entered some text that does not match valid email format',
        given: () => ({
          body: {
            email: 'test.address@planninginspectorate.gov.uk',
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
