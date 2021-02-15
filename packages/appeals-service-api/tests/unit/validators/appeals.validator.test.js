const {
  appealInsertValidationRules,
  appealUpdateValidationRules,
} = require('../../../src/validators/appeals/appeals.validator');
const { insertAppeal } = require('../../../src/validators/appeals/schemas/insert-appeal');
const { updateAppeal } = require('../../../src/validators/appeals/schemas/update-appeal');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/validators/appeals/schemas/insert-appeal');
jest.mock('../../../src/validators/appeals/schemas/update-appeal');

describe('appeals.validators', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  describe('appealInsertValidationRules', () => {
    test('it should validate the appeal', async () => {
      insertAppeal.validate.mockImplementation(() => true);
      appealInsertValidationRules(req, res, (result) => {
        expect(insertAppeal.validate).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });
    test('it should return an error', async () => {
      const error = new Error('Validation error');
      insertAppeal.validate.mockImplementation(() => Promise.reject(error));
      appealInsertValidationRules(req, res, (result) => {
        expect(insertAppeal.validate).toHaveBeenCalled();
        expect(result.code).toBe(400);
        expect(result.message).toBe('Validation error');
      });
    });
  });

  describe('appealUpdateValidationRules', () => {
    test('it should validate the appeal', async () => {
      updateAppeal.validate.mockImplementation(() => true);
      appealInsertValidationRules(req, res, (result) => {
        expect(updateAppeal.validate).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });
    test('it should return an error', async () => {
      const error = new Error('Validation error');
      updateAppeal.validate.mockImplementation(() => Promise.reject(error));
      appealUpdateValidationRules(req, res, (result) => {
        expect(updateAppeal.validate).toHaveBeenCalled();
        expect(result.code).toBe(400);
        expect(result.message).toBe('Validation error');
      });
    });
  });
});
