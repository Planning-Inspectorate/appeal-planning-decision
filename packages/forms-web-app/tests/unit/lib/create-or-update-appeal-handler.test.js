const { endOfDay } = require('date-fns');

const {
  createdOrUpdatedAppealHandler,
  expiryDecisionDateErrTxt,
} = require('../../../src/lib/create-or-update-appeal-handler');

jest.mock('../../../src/lib/logger');
jest.mock('../../../src/lib/appeals-api-wrapper');

const logger = require('../../../src/lib/logger');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');
const { createOrUpdateAppeal } = require('../../../src/lib/appeals-api-wrapper');

describe('lib/create-or-update-appeal-handler', () => {
  let req;
  let res;
  const createOrUpdateAppealErrHandler = jest.fn();
  const today = endOfDay(new Date());

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.resetAllMocks();
  });

  it('should re-render redirect to Expired Decision Date template if this is the error', async () => {
    const error = new Error(expiryDecisionDateErrTxt);
    req.session.appeal.decisionDate = createOrUpdateAppeal.mockImplementation(() =>
      Promise.reject(error)
    );

    req.session.appeal.decisionDate = today;

    await createdOrUpdatedAppealHandler({ req, res, createOrUpdateAppealErrHandler });

    expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    expect(req.session.expiredDecisionDate).toEqual(today);
    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('should call the custom error handler', async () => {
    const error = new Error('custom error');
    req.session.appeal.decisionDate = createOrUpdateAppeal.mockImplementation(() =>
      Promise.reject(error)
    );

    req.session.appeal.decisionDate = today;

    await createdOrUpdatedAppealHandler({ req, res, createOrUpdateAppealErrHandler });

    expect(res.redirect).not.toHaveBeenCalledWith();
    expect(req.session.expiredDecisionDate).toEqual(undefined);
    expect(createOrUpdateAppealErrHandler).toHaveBeenCalledWith(error);
  });
});
