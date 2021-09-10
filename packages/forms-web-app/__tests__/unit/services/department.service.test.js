const { resetDepartments } = require('../../../src/services/department.service');
const { getDepartmentFromName } = require('../../../src/services/department.service');
const { getDepartmentFromId } = require('../../../src/services/department.service');
const { getDepartmentData } = require('../../../src/services/department.service');
const { getRefreshedDepartmentData } = require('../../../src/services/department.service');
const { getLPAList } = require('../../../src/lib/appeals-api-wrapper');

jest.mock('../../../src/lib/appeals-api-wrapper');

describe('services/department.service', () => {
  beforeEach(() => {
    resetDepartments();
    jest.resetAllMocks();
  });

  describe('getRefreshedDepartmentData', () => {
    it('should  give empty result ', async () => {
      await getLPAList.mockResolvedValue({ data: [] });

      const { departments, eligibleDepartments, ineligibleDepartments } =
        await getRefreshedDepartmentData();

      expect(departments).toEqual([]);
      expect(eligibleDepartments).toEqual([]);
      expect(ineligibleDepartments).toEqual([]);
    });
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

      const { departments, eligibleDepartments, ineligibleDepartments } =
        await getRefreshedDepartmentData();

      expect(departments).toEqual(['lpa1', 'lpa2']);
      expect(eligibleDepartments).toEqual(['lpa1']);
      expect(ineligibleDepartments).toEqual(['lpa2']);

      await getLPAList.mockResolvedValue({ data: [] });

      const {
        departments: d,
        eligibleDepartments: e,
        ineligibleDepartments: i,
      } = await getDepartmentData();
      expect(d).toEqual(['lpa1', 'lpa2']);
      expect(e).toEqual(['lpa1']);
      expect(i).toEqual(['lpa2']);
    });
  });

  describe('getDepartmentData', () => {
    it('should  give empty result ', async () => {
      await getLPAList.mockResolvedValue({ data: [] });

      const { departments, eligibleDepartments, ineligibleDepartments } = await getDepartmentData();

      expect(departments).toEqual([]);
      expect(eligibleDepartments).toEqual([]);
      expect(ineligibleDepartments).toEqual([]);
    });
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

      const { departments, eligibleDepartments, ineligibleDepartments } = await getDepartmentData();

      expect(departments).toEqual(['lpa1', 'lpa2']);
      expect(eligibleDepartments).toEqual(['lpa1']);
      expect(ineligibleDepartments).toEqual(['lpa2']);

      await getLPAList.mockResolvedValue({ data: [] });

      const {
        departments: d,
        eligibleDepartments: e,
        ineligibleDepartments: i,
      } = await getDepartmentData();
      expect(d).toEqual(['lpa1', 'lpa2']);
      expect(e).toEqual(['lpa1']);
      expect(i).toEqual(['lpa2']);
    });
  });
  describe('getDepartmentFromId', () => {
    it('should return department by Id', async () => {
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

      const lpa1 = await getDepartmentFromId('id1');
      const lpa2 = await getDepartmentFromId('id2');
      const unknownLPD = await getDepartmentFromName('unknownLPD');

      expect(lpa1).toEqual(mockData.data[0]);
      expect(lpa2).toEqual(mockData.data[1]);
      expect(unknownLPD).toBeUndefined();
    });
  });
  describe('getDepartmentFromName', () => {
    it('should return department by Name', async () => {
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

      const lpa1 = await getDepartmentFromName('lpa1');
      const lpa2 = await getDepartmentFromName('lpa2');
      const unknownLPD = await getDepartmentFromName('unknownLPD');

      expect(lpa1).toEqual(mockData.data[0]);
      expect(lpa2).toEqual(mockData.data[1]);
      expect(unknownLPD).toBeUndefined();
    });
  });
  describe('resetDepartments', () => {
    it('should return department by Name', async () => {
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

      resetDepartments();

      const { departments: d, eligibleDepartments: e } = await getDepartmentData();

      expect(d).toEqual(['lpa1', 'lpa2']);
      expect(e).toEqual(['lpa1', 'lpa2']);
    });
  });
});
