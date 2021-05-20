const { validationResult } = require('express-validator');
const validationErrorHandler = require('../../src/validators/validation-error-handler');
const { mockReq, mockRes } = require('../mocks');

jest.mock('express-validator');

describe('validators/validation-error-handler', () => {
  [
    {
      description: 'no errors',
      given: () => {
        validationResult.mockImplementation(() => ({
          isEmpty: () => true,
        }));

        return mockReq;
      },
      expected: (req, res, next) => {
        expect(next).toHaveBeenCalled();
        expect(req.body).toBeUndefined();
      },
    },
    {
      description: 'with errors',
      given: () => {
        validationResult.mockImplementation(() => ({
          isEmpty: () => false,
          mapped: () => ({
            some: 'error',
          }),
        }));

        const req = mockReq();
        req.body = {
          hello: false,
        };

        return req;
      },
      expected: (req, res, next) => {
        expect(req.body).toBeDefined();
        expect(req.body.errors).toBeDefined();
        expect(req.body.errorSummary).toBeDefined();
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ description, given, expected }) => {
    it(`should validate - ${description}`, () => {
      const next = jest.fn();
      const req = given();
      validationErrorHandler(req, mockRes, next);
      expected(req, mockRes, next);
    });
  });
});
