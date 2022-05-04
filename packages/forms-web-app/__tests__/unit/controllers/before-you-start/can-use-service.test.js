const fullAppeal = require('../../../mockData/full-appeal');
const householderAppeal = require('../../../mockData/householder-appeal');
const canUseServiceController = require('../../../../src/controllers/before-you-start/can-use-service');
const { getDepartmentFromId } = require('../../../../src/services/department.service');

const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { CAN_USE_SERVICE_HOUSEHOLDER: canUseServiceHouseholder },
    },
  },
} = require('../../../../src/lib/householder-planning/views');

const {
  VIEW: {
    FULL_APPEAL: { CAN_USE_SERVICE_FULL_APPEAL: canUseServiceFullAppealUrl },
  },
} = require('../../../../src/lib/full-appeal/views');

jest.mock('../../../../src/services/department.service');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/can-use-service', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();
    res = mockRes();
    getDepartmentFromId.mockImplementation(() => Promise.resolve({ name: 'Bradford' }));
  });

  it('Test getCanUseService method calls the HP Check Your Answers page when typeOfPlanningApplication is householder-planning', async () => {
    req = mockReq(householderAppeal);

    await canUseServiceController.getCanUseService(req, res);

    expect(res.render).toBeCalledWith(canUseServiceHouseholder, {
      appealLPD: 'Bradford',
      applicationDecision: 'Granted',
      applicationType: 'Householder Planning',
      claimingCosts: 'No',
      deadlineDate: { date: 27, day: 'Wednesday', month: 'July', year: 2022 },
      decisionDate: '04 May 2022',
      enforcementNotice: 'No',
      isListedBuilding: 'No',
    });
  });

  it('Test getCanUseService method calls the Full Appeal Check Your Answers page when typeOfPlanningApplication is full-appeal', async () => {
    req = mockReq(fullAppeal);

    await canUseServiceController.getCanUseService(req, res);

    expect(res.render).toBeCalledWith(canUseServiceFullAppealUrl, {
      appealLPD: 'Bradford',
      applicationDecision: 'Granted',
      applicationType: 'Full Appeal',
      deadlineDate: { date: 4, day: 'Friday', month: 'November', year: 2022 },
      decisionDate: '04 May 2022',
      enforcementNotice: 'No',
    });
  });
});
