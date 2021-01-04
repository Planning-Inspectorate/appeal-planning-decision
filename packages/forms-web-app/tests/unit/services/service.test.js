const { getDepartmentData } = require('../../../src/services/department.service');
const { getLPAList } = require('../../../src/lib/appeals-api-wrapper');

jest.mock('../../../src/lib/appeals-api-wrapper');

describe('services/service', () => {
  describe('getDepartmentData', () => {
    it('should transform data', async () => {
      const mockData = {
        data: [
          {
            id: 'id1',
            name: 'lpa1',
            inTrial: true,
          },
          {
            id: 'id2',
            name: 'lpa2',
            inTrial: false,
          },
        ],
      };
      await getLPAList.mockResolvedValue(mockData);

      const { departments, eligibleDepartments } = await getDepartmentData();

      expect(departments).toEqual(['lpa1', 'lpa2']);
      expect(eligibleDepartments).toEqual(['lpa1']);

      mockData.data[1].inTrial = true;

      const { departments: d, eligibleDepartments: e } = await getDepartmentData();

      expect(d).toEqual(['lpa1', 'lpa2']);
      expect(e).toEqual(['lpa1', 'lpa2']);
    });
  });
  it('should  give empty result ', async () => {
    await getLPAList.mockResolvedValue({ data: [] });

    const { departments, eligibleDepartments } = await getDepartmentData();

    expect(departments).toEqual([]);
    expect(eligibleDepartments).toEqual([]);
  });
});
