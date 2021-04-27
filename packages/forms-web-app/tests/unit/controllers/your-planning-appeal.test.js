const yourPlanningAppealController = require('../../../src/controllers/your-planning-appeal');
const { getAppeal } = require('../../../src/models/appealModel');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

jest.mock('../../../src/models/appealModel');

describe('controllers/your-planning-appeal', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getYourPlanningAppeal', () => {
    it('should render the correct view with the appeal data', async () => {
      const appeal = {
        id: '1234',
      };
      getAppeal.mockResolvedValue(appeal);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_PLANNING_APPEAL, {
        appeal,
      });
    });

    it('should call next() when appeal API returns 404', async () => {
      const error = { response: { status: 404 } };
      getAppeal.mockRejectedValue(error);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next(error) when appeal API returns error', async () => {
      const error = { response: { status: 500 } };
      getAppeal.mockRejectedValue(error);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
