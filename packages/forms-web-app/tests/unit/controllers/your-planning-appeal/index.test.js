const yourPlanningAppealController = require('../../../../src/controllers/your-planning-appeal');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

describe('controllers/your-planning-appeal/index', () => {
  let req;
  let res;
  let next;
  const appeal = {
    id: '1234',
  };
  const lpd = {
    name: 'Test Council',
  };

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
      req = {
        ...req,
        session: {
          ...req.session,
          appeal,
          appealLPD: lpd,
        },
      };
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_PLANNING_APPEAL.INDEX, {
        appeal,
        lpd,
      });
    });

    it('should call next() when appealLPD data is not in session', async () => {
      req = {
        ...req,
        session: {
          ...req.session,
          appeal,
        },
      };
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when appeal data is not in session', async () => {
      await yourPlanningAppealController.getYourPlanningAppeal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
