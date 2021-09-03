const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const rules = require('../../../../src/validators/question-type/boolean');

describe('validators/question-type/boolean', () => {
  describe('rules', () => {
    it('has a rule for unfilled boolean', () => {
      const rule = rules()[0].builder.build();
      expect(rule.fields).toEqual(['booleanInput']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('has a rule for empty text field', () => {
      const rule = rules()[1].builder.build();
      expect(rule.fields).toEqual(['booleanInputText']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].validator.negated).toBeFalsy();
    });

    it('should have the expected number of configured rules', () => {
      expect(rules().length).toEqual(2);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined / empty - fail ',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock error message');
        },
      },
      {
        title: 'input key is empty - fail',
        given: () => ({
          body: { booleanInput: null },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock error message');
        },
      },
      {
        title: 'no answer but no error message passed - pass',
        given: () => ({
          body: {},
        }),
        errorMessage: null,
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'answer is yes - pass',
        given: () => ({
          body: { booleanInput: 'yes' },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'answer is no - pass',
        given: () => ({
          body: { booleanInput: 'no' },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'text is required for yes, text is empty - fail',
        given: () => ({
          body: { booleanInput: 'yes', booleanInputText: '' },
        }),
        textConfig: {
          parentValue: true,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock text error message');
        },
      },
      {
        title: 'text is required for yes, text is filled - pass',
        given: () => ({
          body: { booleanInput: 'yes', booleanInputText: 'mock value' },
        }),
        textConfig: {
          parentValue: true,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'text is required for yes, no is answered - pass',
        given: () => ({
          body: { booleanInput: 'no', booleanInputText: '' },
        }),
        textConfig: {
          parentValue: true,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'text is required for no, text is empty - fail',
        given: () => ({
          body: { booleanInput: 'no', booleanInputText: '' },
        }),
        textConfig: {
          parentValue: false,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Mock text error message');
        },
      },
      {
        title: 'text is required for no, text is filled - pass',
        given: () => ({
          body: { booleanInput: 'no', booleanInputText: 'mock value' },
        }),
        textConfig: {
          parentValue: false,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'not required, text for yes, body is empty - pass',
        given: () => ({
          body: {},
        }),
        errorMessage: '',
        textConfig: {
          parentValue: true,
          emptyError: 'Mock text error message',
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected, errorMessage = 'Mock error message', textConfig }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, rules(errorMessage, textConfig));
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
