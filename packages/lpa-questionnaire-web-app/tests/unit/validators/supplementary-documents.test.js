const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const rules = require('../../../src/validators/supplementary-documents');

jest.mock('../../../src/validators/files', () => jest.fn(() => []));
jest.mock('../../../src/validators/custom/date-input', () => jest.fn(() => []));

describe('validators/suplementary-documents', () => {
  describe('rules', () => {
    it('has a rule for empty documents', () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['documents']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].message).toEqual('Upload a relevant supplementary planning document');
    });

    it('has a rule for document name', () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['documentName']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual('Enter a name for the supplementary planning document');
    });

    it('has a rule for fomally adopted', () => {
      const rule = rules()[2].builder.build();

      expect(rule.fields).toEqual(['formallyAdopted']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(3);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual(
        'Select whether this supplementary planning document has been adopted'
      );

      expect(rule.stack[2].validator.name).toEqual('isIn');
      expect(rule.stack[2].options[0]).toEqual(['yes', 'no']);
    });

    it(`has a rule for adopted date in the future`, () => {
      const rule = rules()[3].builder.build();

      expect(rule.fields).toEqual(['adoptedDate']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].negated).toBeFalsy();
    });

    it('has a rule for stage reached', () => {
      const rule = rules()[4].builder.build();

      expect(rule.fields).toEqual(['stageReached']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(2);

      expect(rule.stack[0].chain).toHaveProperty('if');
      expect(rule.stack[0].chain.builder.fields).toEqual(['formallyAdopted']);
      expect(rule.stack[0].chain.builder.locations).toEqual(['body']);

      expect(rule.stack[1].validator.name).toEqual('isEmpty');
      expect(rule.stack[1].negated).toBeTruthy();
      expect(rule.stack[1].message).toEqual(
        'Tell us what stage the supplementary planning document has reached'
      );
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
          expect(result.errors).toHaveLength(3);
          expect(
            result.errors.some(
              (error) => error.msg === 'Enter a name for the supplementary planning document'
            )
          ).toBe(true);
          expect(
            result.errors.some(
              (error) => error.msg === 'Upload a relevant supplementary planning document'
            )
          ).toBe(true);
          expect(
            result.errors.some(
              (error) =>
                error.msg === 'Select whether this supplementary planning document has been adopted'
            )
          ).toBe(true);
        },
      },
      {
        title: 'invalid (yes selected, date in future) - fail',
        given: () => ({
          body: {
            files: { documents: ['mock-file.pdf'] },
            documentName: 'Mock Doc',
            formallyAdopted: 'yes',
            adoptedDate: '3500-01-01',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe('Date of adoption must be in the past');
        },
      },
      {
        title: 'valid (yes selected, date in past) - pass',
        given: () => ({
          body: {
            files: { documents: ['mock-file.pdf'] },
            documentName: 'Mock Doc',
            formallyAdopted: 'yes',
            adoptedDate: '2015-01-01',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'invalid (no selected, stage reached empty) - fail',
        given: () => ({
          body: {
            files: { documents: ['mock-file.pdf'] },
            documentName: 'Mock Doc',
            formallyAdopted: 'no',
            stageReached: '',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toBe(
            'Tell us what stage the supplementary planning document has reached'
          );
        },
      },
      {
        title: 'valid (no selected, stage reached filled) - pass',
        given: () => ({
          body: {
            files: { documents: ['mock-file.pdf'] },
            documentName: 'Mock Doc',
            formallyAdopted: 'no',
            stageReached: 'mock stage',
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
