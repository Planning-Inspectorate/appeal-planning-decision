const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/appellant-submission/appeal-statement');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('routes/validators/grounds-appeal', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rules().length).toEqual(2);
      expect(rule.fields).toEqual(['privacy-safe']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].message).toEqual(
        'You cannot provide a statement that includes sensitive information'
      );
    });
  });
  describe('validator', () => {
    [
      {
        title: 'Privacy confirmation has been checked and valid appeal was uploaded',
        given: () => ({
          body: {
            'appeal-statement-file-upload': 'appeal.pdf',
            'privacy-safe': 'true',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'Privacy confirmation has not been checked',
        given: () => ({
          body: {
            'appeal-statement-file-upload': 'appeal.pdf',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'You cannot provide a statement that includes sensitive information'
          );
          expect(result.errors[0].param).toEqual('privacy-safe');
        },
      },
      {
        title: 'No appeal was uploaded',
        given: () => ({
          body: {
            'privacy-safe': 'true',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Select an appeal statement');
          expect(result.errors[0].param).toEqual('appeal-statement-file-upload');
        },
      },
      {
        title: 'Appeal with wrong format uploaded',
        given: () => ({
          body: {
            'appeal-statement-file-upload': 'appeal.txt',
            'privacy-safe': 'true',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'The selected file must be a PDF, Microsoft Word, TIF, JPEG or PNG'
          );
          expect(result.errors[0].param).toEqual('appeal-statement-file-upload');
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
