const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/common/yes-no');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/yes-no', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules('yes-no')[0].builder.build();

      expect(rule.fields).toEqual(['yes-no']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual('Select an option');

      expect(rule.stack[2].negated).toBeFalsy();
      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options).toEqual([['yes', 'no']]);
      expect(rule.stack[2].message).toEqual('Select an option');
    });
  });

  describe('validator', () => {
    const res = jest.fn();

    it('should return an error if no options have been selected', async () => {
      const req = {
        body: {},
      };
      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].location).toEqual('body');
      expect(result.errors[0].msg).toEqual('Select an option');
      expect(result.errors[0].param).toEqual('yes-no');
      expect(result.errors[0].value).toEqual(undefined);
    });

    it('should return an error if an invalid option been selected', async () => {
      const req = {
        body: {
          'yes-no': 'invalid-value',
        },
      };

      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].location).toEqual('body');
      expect(result.errors[0].msg).toEqual('Select an option');
      expect(result.errors[0].param).toEqual('yes-no');
      expect(result.errors[0].value).toEqual('invalid-value');
    });

    it('should not retun an error is a valid option of `yes` is selected', async () => {
      const req = {
        body: {
          'yes-no': 'yes',
        },
      };

      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(0);
    });

    it('should not retun an error is a valid option of `no` is selected', async () => {
      const req = {
        body: {
          'yes-no': 'no',
        },
      };

      await testExpressValidatorMiddleware(req, res, rules('yes-no'));

      const result = validationResult(req);

      expect(result.errors).toHaveLength(0);
    });
  });
});
