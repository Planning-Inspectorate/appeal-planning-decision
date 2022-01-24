const { validationResult } = require('express-validator');
const {
  constants: { KNOW_THE_OWNERS },
} = require('@pins/business-rules');
const { rules } = require('../../../../src/validators/common/options');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/yes-no', () => {
  const defaultError = 'Select an option';
  const defaultOptions = ['yes', 'no'];
  const customError = 'Select if you know who owns the rest of the land involved in the appeal';
  const customOptions = Object.values(KNOW_THE_OWNERS);

  describe('rules', () => {
    it('is configured with the expected rules when not given an error message or options', () => {
      const rule = rules('yes-no')[0].builder.build();

      expect(rule.fields).toEqual(['yes-no']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual(defaultError);

      expect(rule.stack[2].negated).toBeFalsy();
      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options).toEqual([defaultOptions]);
      expect(rule.stack[2].message).toEqual(defaultError);
    });

    it('is configured with the expected rules when given an error message and options', () => {
      const rule = rules('yes-no', customError, customOptions)[0].builder.build();

      expect(rule.fields).toEqual(['yes-no']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual(customError);

      expect(rule.stack[2].negated).toBeFalsy();
      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options).toEqual([customOptions]);
      expect(rule.stack[2].message).toEqual(customError);
    });
  });

  describe('validator', () => {
    const res = jest.fn();

    it('should return an error if no value have been given', async () => {
      const req = {
        body: {},
      };
      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].location).toEqual('body');
      expect(result.errors[0].msg).toEqual(defaultError);
      expect(result.errors[0].param).toEqual('yes-no');
      expect(result.errors[0].value).toEqual(undefined);
    });

    it('should return an error if an invalid option is given', async () => {
      const req = {
        body: {
          'yes-no': 'invalid-value',
        },
      };

      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].location).toEqual('body');
      expect(result.errors[0].msg).toEqual(defaultError);
      expect(result.errors[0].param).toEqual('yes-no');
      expect(result.errors[0].value).toEqual('invalid-value');
    });

    it('should not retun an error if a valid option is given', async () => {
      const req = {
        body: {
          'yes-no': 'yes',
        },
      };

      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(0);
    });
  });
});
