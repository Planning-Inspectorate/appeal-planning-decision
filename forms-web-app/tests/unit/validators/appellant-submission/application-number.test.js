jest.mock('../../../../src/services/department.service');
const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/appellant-submission/application-number');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/appellant-submission/application-number', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rules().length).toEqual(1);
      expect(rule.fields).toEqual(['application-number']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual('Enter your planning application number');

      expect(rule.stack[2].validator.name).toEqual('isLength');
      expect(rule.stack[2].options).toEqual([{ min: 1, max: 30 }]);
      expect(rule.stack[2].message).toEqual(
        'Planning application number must be 30 characters or fewer'
      );
    });
  });
  describe('validator', () => {
    [
      {
        title: 'valid planning application number provided',
        given: () => ({
          body: {
            'application-number': 'valid entry here',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'planning application number not provided',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter your planning application number');
        },
      },
      {
        title: 'planning application number provided but empty',
        given: () => ({
          body: {
            'application-number': '',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter your planning application number');
        },
      },
      {
        title: 'planning application number provided but exceeds 30 characters',
        given: () => ({
          body: {
            'application-number': '1234567890123456789012345678901',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'Planning application number must be 30 characters or fewer'
          );
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
