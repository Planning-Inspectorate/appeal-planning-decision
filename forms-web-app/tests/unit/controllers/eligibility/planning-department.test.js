jest.mock('../../../../src/services/department.service');

const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { getDepartmentData } = require('../../../../src/services/department.service');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

const departmentsData = {
  departments: ['lpa1', 'lpa2'],
  eligibleDepartments: ['lpa1'],
};

getDepartmentData.mockResolvedValue(departmentsData);

describe('controller/eligibility/planning-department', () => {
  describe('Planning Department Controller Tests', () => {
    it('should call the correct template', async () => {
      await planningDepartmentController.getPlanningDepartment(req, res);

      const { departments } = departmentsData;

      expect(res.render).toBeCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, { departments });
    });

    it('Test the getPlanningDepartmentOut method calls the correct template', () => {
      planningDepartmentController.getPlanningDepartmentOut(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT);
    });

    it('Test the postPlanningDepartment method call with handled department', async () => {
      const mockRequest = {
        body: { 'local-planning-department': 'lpa1' },
      };

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(res.redirect).toBeCalledWith(`/${VIEW.ELIGIBILITY.LISTED_BUILDING}`);
    });

    it('Test the getPlanningDepartment method call with ineligible department', async () => {
      const mockRequest = {
        body: { errors: { 'local-planning-department': { msg: 'Ineligible Department' } } },
      };
      const { eligibleDepartments } = departmentsData;

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);
      expect(res.render).toBeCalledWith(
        VIEW.ELIGIBILITY.PLANNING_DEPARTMENT_OUT,
        eligibleDepartments
      );
    });

    it('Test the postPlanningDepartment method call on error', async () => {
      const mockRequest = {
        body: { errors: { 'local-planning-department': { msg: 'Invalid Value' } } },
      };

      const { departments } = departmentsData;
      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.PLANNING_DEPARTMENT, {
        departments,
        errors: { 'local-planning-department': { msg: 'Invalid Value' } },
        errorSummary: [],
      });
    });
  });
});
