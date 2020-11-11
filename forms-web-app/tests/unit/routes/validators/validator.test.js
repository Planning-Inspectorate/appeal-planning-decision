const { validationResult } = require('express-validator');
const { validator } = require('../../../../src/routes/validators/validator');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('express-validator');

describe('routes/validators/validator', () => {
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
      validator(req, mockRes, next);
      expected(req, mockRes, next);
    });
  });
});
