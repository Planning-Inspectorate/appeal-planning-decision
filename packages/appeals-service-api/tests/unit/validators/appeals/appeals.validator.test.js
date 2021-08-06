const {
  schemas: { validate },
} = require('@pins/business-rules');
const { mockReq, mockRes } = require('../../mocks');
const {
  appealUpdateValidationRules,
  appealInsertValidationRules,
} = require('../../../../src/validators/appeals/appeals.validator');
const ApiError = require('../../../../src/error/apiError');
const { isAppealSubmitted } = require('../../../../src/services/appeal.service');

jest.mock('@pins/business-rules', () => ({
  constants: {
    APPEAL_ID: {
      HOUSEHOLDER: '1001',
    },
  },
  schemas: {
    validate: {
      insert: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('../../../../src/services/appeal.service', () => ({
  isAppealSubmitted: jest.fn(),
}));

describe('appeals.validator', () => {
  const next = jest.fn();

  let req;
  let res;
  let data;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    data = {
      id: 'f8f96ee9-f66b-474e-9bd0-4bea0292eab5',
    };

    jest.resetAllMocks();
  });

  describe('appealUpdateValidationRules', () => {
    it('should call next with no error when appealId exists and appealId matches pathId', async () => {
      validate.update.mockImplementation(() => data);

      req.body = data;
      req.params.id = data.id;

      await appealUpdateValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();
    });

    it('should call next with no error when appealId does not exist', async () => {
      data = {
        lpaCode: 'E69999999',
        appealType: '1000',
      };

      validate.update.mockImplementation(() => data);

      req.body = data;
      req.params.id = data.id;

      await appealUpdateValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();
    });

    it('should call next with an error when appealId exists and appealId does not match pathId', async () => {
      validate.update.mockImplementation(() => data);

      req.body = data;
      req.params.id = '46bcc877-d0b2-4922-a135-92d6b1bd13fc';

      await appealUpdateValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(ApiError.notSameId());
    });

    it('should call next with an error when an error is thrown', async () => {
      await appealUpdateValidationRules(req, res, next);

      expect(req.body).toEqual(undefined);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(
        ApiError.badRequest(new TypeError("Cannot read property 'id' of undefined"))
      );
    });
  });

  describe('appealInsertValidationRules', () => {
    it('should call next with an error if the appeal already exists', async () => {
      isAppealSubmitted.mockReturnValue(true);

      data = {
        lpaCode: 'E69999999',
        appealType: '1000',
      };

      validate.insert.mockImplementation(() => data);

      req.body = data;
      req.params.id = data.id;

      await appealInsertValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(ApiError.appealAlreadySubmitted());
    });

    it('should call next with no error when appealId does not exist', async () => {
      data = {
        lpaCode: 'E69999999',
        appealType: '1000',
      };

      validate.insert.mockImplementation(() => data);

      req.body = data;
      req.params.id = data.id;

      await appealInsertValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();
    });

    it('should call next with an error when appealId exists and appealId does not match pathId', async () => {
      validate.insert.mockImplementation(() => data);

      req.body = data;
      req.params.id = '46bcc877-d0b2-4922-a135-92d6b1bd13fc';

      await appealInsertValidationRules(req, res, next);

      expect(req.body).toEqual(data);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(ApiError.notSameId());
    });

    it('should call next with an error when an error is thrown', async () => {
      await appealInsertValidationRules(req, res, next);

      expect(req.body).toEqual(undefined);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith(
        ApiError.badRequest(new TypeError("Cannot read property 'id' of undefined"))
      );
    });
  });
});
