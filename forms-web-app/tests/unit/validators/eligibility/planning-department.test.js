const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/eligibility/planning-department');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('routes/validators/planning-department', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      const rule = rules()[0].builder.build();

      expect(rules().length).toEqual(1);
      expect(rule.fields).toEqual(['local-planning-department']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(1);
      expect(rule.stack[0].message).toEqual('You need to provide the local planning department');
    });
  });
  describe('validator', () => {
    [
      {
        title: 'local planning department provided',
        given: () => ({
          body: {
            'local-planning-department': 'Council',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'local planning department is not provided',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('You need to provide the local planning department');
          expect(result.errors[0].param).toEqual('local-planning-department');
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
