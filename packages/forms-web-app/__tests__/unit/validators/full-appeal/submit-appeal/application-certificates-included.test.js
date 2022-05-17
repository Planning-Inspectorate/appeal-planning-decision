const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../../validation-middleware-helper');
const {
  rules,
  separateCertificateSubmittedOptions,
} = require('../../../../../src/validators/full-appeal/submit-appeal/application-certificates-included');

describe('validators/full-appeal/submit-appeal/application-certificates-included', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['did-you-submit-separate-certificate']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);
      expect(rule.stack[0].message).toEqual(
        'Select yes if you submitted a separate ownership certificate and agricultural land declaration'
      );
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
            'Select yes if you submitted a separate ownership certificate and agricultural land declaration'
          );
          expect(result.errors[0].param).toEqual('did-you-submit-separate-certificate');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid value - fail',
        given: () => ({
          body: {
            'did-you-submit-separate-certificate': 12,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Invalid value');
          expect(result.errors[0].param).toEqual('did-you-submit-separate-certificate');
          expect(result.errors[0].value).toEqual(12);
        },
      },
      {
        title: 'valid value - "yes" - pass',
        given: () => ({
          body: {
            'did-you-submit-separate-certificate': 'yes',
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
            'did-you-submit-separate-certificate': 'no',
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

  describe('separateCertificateSubmittedOptions', () => {
    it('should define the expected valid certificate options', () => {
      expect(separateCertificateSubmittedOptions).toEqual(['yes', 'no']);
    });
  });
});
