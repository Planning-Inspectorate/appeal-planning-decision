jest.mock('../../../../src/lib/appeals-api-wrapper');

const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { mockReq, mockRes } = require('../../mocks');
const { getLPAList } = require('../../../../src/lib/appeals-api-wrapper');

const req = mockReq();
const res = mockRes();

const sampleLpa = [
  {
    name: 'lpa1',
    inTrial: true,
  },
  {
    name: 'lpa2',
    inTrial: false,
  },
];

getLPAList.mockResolvedValue({
  data: sampleLpa,
});

describe('controller/eligibility/planning-department', () => {
  describe('Planning Department Controller Tests', () => {
    it('should call the correct template', async () => {
      await planningDepartmentController.getPlanningDepartment(req, res);

      const data = sampleLpa.map(({ name }) => name);

      expect(res.render).toBeCalledWith('eligibility/planning-department', { data });
    });

    it('Test the getPlanningDepartmentOut method calls the correct template', () => {
      planningDepartmentController.getPlanningDepartmentOut(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/planning-department-out');
    });

    it('Test the postPlanningDepartment method call with handled department', async () => {
      const mockRequest = {
        body: { 'local-planning-department': 'lpa1' },
      };

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(res.redirect).toBeCalledWith('/eligibility/listed-building');
    });

    it('Test the getPlanningDepartment method call with unhandled department', async () => {
      const mockRequest = {
        body: { 'local-planning-department': 'lpa3' },
      };

      await planningDepartmentController.postPlanningDepartment(mockRequest, res);
      expect(res.render).toBeCalledWith('eligibility/planning-department-out');
    });

    it('Test the postPlanningDepartment method call on error', async () => {
      const mockRequest = { body: { errors: [1] } };

      const data = sampleLpa.map(({ name }) => name);
      await planningDepartmentController.postPlanningDepartment(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/planning-department', {
        data,
        errors: [1],
        errorSummary: {},
      });
    });
  });
});
