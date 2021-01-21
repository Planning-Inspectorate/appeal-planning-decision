const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { getDepartmentFromName } = require('../../../../src/services/department.service');
const { getDepartmentData } = require('../../../../src/services/department.service');
const logger = require('../../../../src/lib/logger');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/empty-appeal');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/eligibility/planning-department', () => {
  let req;
  let res;
  let appeal;
  let departmentsData;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    departmentsData = {
      departments: ['lpa1', 'lpa2'],
      eligibleDepartments: ['lpa1'],
    };

    jest.resetAllMocks();
  });

  describe('Planning Department Controller Tests', () => {
    it('Test the getPlanningDepartment method calls the correct template', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);

      appeal.lpaCode = '';
      await planningDepartmentController.getPlanningDepartment(req, res);

      const { departments, eligibleDepartments, ineligibleDepartments } = departmentsData;

      expect(res.render).toBeCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appealLPD: '',
        departments,
        eligibleDepartments,
        ineligibleDepartments,
      });
    });

    it('Test the getPlanningDepartment method calls the correct template', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);
      getDepartmentFromId.mockResolvedValue(undefined);

      appeal.lpaCode = 'unknown';
      await planningDepartmentController.getPlanningDepartment(req, res);

      const { departments, eligibleDepartments, ineligibleDepartments } = departmentsData;

      expect(res.render).toBeCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appealLPD: '',
        departments,
        eligibleDepartments,
        ineligibleDepartments,
      });
    });

    it('Test the getPlanningDepartment method with existing LPD calls the correct template', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);
      getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

      appeal.lpaCode = 'lpdCode';
      await planningDepartmentController.getPlanningDepartment(req, res);

      const { departments, eligibleDepartments, ineligibleDepartments } = departmentsData;

      expect(res.render).toBeCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appealLPD: 'lpdName',
        departments,
        eligibleDepartments,
        ineligibleDepartments,
      });
    });

    it('Test the getPlanningDepartmentOut method calls the correct template', () => {
      planningDepartmentController.getPlanningDepartmentOut(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT);
    });

    it('Test the postPlanningDepartment method call with handled department', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);
      getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

      const mockRequest = {
        ...req,
        body: { 'local-planning-department': 'lpa1' },
      };

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        lpaCode: 'lpaCode1',
      });

      expect(res.redirect).toBeCalledWith(`/${VIEW.ELIGIBILITY.LISTED_BUILDING}`);
    });

    it('Test the getPlanningDepartment method call with ineligible department', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);
      getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

      const mockRequest = {
        ...req,
        body: { errors: { 'local-planning-department': { msg: 'Ineligible Department' } } },
      };

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        lpaCode: 'lpaCode1',
      });

      expect(res.render).toBeCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT);
    });
    it('Test the postPlanningDepartment method call on error', async () => {
      getDepartmentData.mockResolvedValue(departmentsData);

      const mockRequest = {
        ...req,
        body: { errors: { 'local-planning-department': { msg: 'Invalid Value' } } },
      };

      const { departments } = departmentsData;
      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appealLPD: '',
        departments,
        errors: { 'local-planning-department': { msg: 'Invalid Value' } },
        errorSummary: [],
      });
    });
    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      getDepartmentData.mockResolvedValue(departmentsData);
      getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

      const mockRequest = {
        ...req,
        body: { 'local-planning-department': 'lpa1' },
      };
      await planningDepartmentController.postPlanningDepartment(mockRequest, res);
      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });
  });
});
