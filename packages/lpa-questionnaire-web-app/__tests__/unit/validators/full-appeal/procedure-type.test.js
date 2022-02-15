const { validationResult } = require('express-validator');
const {
  rules,
  validProcedureTypeOptions,
} = require('../../../../src/validators/full-appeal/procedure-type');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/procedure-type', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(2);
    });
  });

  describe('ruleProcedureType', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['procedure-type']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].message).toEqual(
        'Select the procedure that you think is most appropriate for this appeal'
      );

      expect(rule.stack[2].negated).toBeFalsy();
      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options).toEqual([['written-representations', 'hearing', 'inquiry']]);
    });
  });

  describe('validator', () => {
    [
      {
        title: 'No selection made on the procedure type question',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Select the procedure that you think is most appropriate for this appeal'
          );
          expect(result.errors[0].param).toEqual('procedure-type');
          expect(result.errors[0].value).toEqual(undefined);
        },
      },
      {
        title: 'User selected `hearing` on the procedure type question',
        given: () => ({
          body: {
            'procedure-type': 'hearing',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'User selected `inquiry` on the procedure type question, and does not enter a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The number of days you would expect the inquiry to last must be a number, such as 5.'
          );
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered a decimal as the value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': '2.3',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The number of days you would expect the inquiry to last must be a number, such as 5.'
          );
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered too small a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': '0',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The number of days you would expect the inquiry to last must be 1 or more.'
          );
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered too large a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': '1000',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The number of days you would expect the inquiry to last must be fewer than 999.'
          );
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered too large a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': 'abcde',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered too large a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': null,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
        },
      },
      {
        title:
          'User selected `inquiry` on the procedure type question and entered too large a value',
        given: () => ({
          body: {
            'procedure-type': 'inquiry',
            'inquiry-days': 1000,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
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

  describe('validProcedureTypeOptions', () => {
    it('should define the expected valid full appeal application status options', () => {
      expect(validProcedureTypeOptions).toEqual(['written-representations', 'hearing', 'inquiry']);
    });
  });
});
