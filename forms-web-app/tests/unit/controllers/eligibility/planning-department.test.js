const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/eligibility/planning-department', () => {
  describe('getPlanningDepartment', () => {
    it('should call the correct template', () => {
      planningDepartmentController.getPlanningDepartment(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/planning-department');
    });
  });
});
