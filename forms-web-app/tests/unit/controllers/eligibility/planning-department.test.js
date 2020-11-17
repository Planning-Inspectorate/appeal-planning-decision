jest.mock('../../../../src/lib/appeals-api-wrapper');

const planningDepartmentController = require('../../../../src/controllers/eligibility/planning-department');
const { mockReq, mockRes } = require('../../mocks');
const { getLPAList } = require('../../../../src/lib/appeals-api-wrapper');

const req = mockReq();
const res = mockRes();

describe('controller/eligibility/planning-department', () => {
  describe('getPlanningDepartment', () => {
    it('should call the correct template', async () => {
      const sampleLpa = [
        {
          name: 'lpa1',
        },
        {
          name: 'lpa2',
        },
      ];

      getLPAList.mockResolvedValue({
        data: sampleLpa,
      });

      await planningDepartmentController.getPlanningDepartment(req, res);

      const data = sampleLpa.map(({ name }) => name);

      expect(res.render).toBeCalledWith('eligibility/planning-department', { data });
    });
  });
});
