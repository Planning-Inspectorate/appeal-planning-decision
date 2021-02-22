const extraConditions = require('../../../src/controllers/extra-conditions');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/extra-conditions', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('get extra conditions', () => {
    it('should call the correct template', () => {
      req.session.backLink = `/mock-id/mock-back-link`;

      extraConditions.getExtraConditions(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/mock-id/mock-back-link`,
      });
    });
  });

  it('it should have the correct backlink when no request session object exists.', () => {
    extraConditions.getExtraConditions(req, res);

    expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
      appeal: null,
      backLink: `/mock-id/${VIEW.TASK_LIST}`,
    });
  });
});
