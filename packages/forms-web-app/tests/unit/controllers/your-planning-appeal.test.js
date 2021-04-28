const yourPlanningAppealController = require('../../../src/controllers/your-planning-appeal');
const { getAppeal } = require('../../../src/models/appealModel');
const { getDepartmentFromId } = require('../../../src/services/department.service');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

jest.mock('../../../src/models/appealModel');
jest.mock('../../../src/services/department.service');

describe('controllers/your-planning-appeal', () => {
  const appeal = {
    id: '1234',
  };
  const lpd = {
    name: 'Test Council',
  };
  const error404 = { response: { status: 404 } };
  const error500 = { response: { status: 500 } };
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
      getDepartmentFromId.mockResolvedValue(lpd);
      getAppeal.mockResolvedValue(appeal);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_PLANNING_APPEAL, {
        appeal,
        lpd,
      });
    });

    it('should call next() when appeal API returns 404', async () => {
      getAppeal.mockRejectedValue(error404);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next(error) when appeal API returns error', async () => {
      getAppeal.mockRejectedValue(error500);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith(error500);
    });

    it('should call next() when LPD Service returns 404', async () => {
      getAppeal.mockResolvedValue(appeal);
      getDepartmentFromId.mockRejectedValue(error404);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next(error) when LPD Service returns error', async () => {
      getAppeal.mockResolvedValue(appeal);
      getDepartmentFromId.mockRejectedValue(error500);
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith(error500);
    });
  });
});
