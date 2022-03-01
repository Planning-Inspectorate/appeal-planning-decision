const { getLpa } = require('../../../src/services/lpa.service');

jest.mock('../../../src/schemas/lpa', () => ({
  findOne: jest
    .fn()
    .mockImplementationOnce(() => ({
      email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
      name: 'System Test Borough Council',
    }))
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
    .mockImplementationOnce(() => ({
      email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
    }))
    .mockImplementationOnce(() => ({
      name: 'System Test Borough Council',
    })),
}));
jest.mock('../../../src/lib/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('services/lpa.service', () => {
  const lpaCode = 'E69999999';

  describe('getLpa', () => {
    it('should return the LPA when a LPA is found', async () => {
      const lpa = await getLpa(lpaCode);

      expect(lpa).toEqual({
        email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
        name: 'System Test Borough Council',
      });
    });

    it('should throw an error when a LPA is not found', () => {
      expect(() => getLpa(lpaCode)).rejects.toThrow(
        `Unable to find LPA email or name for code ${lpaCode}`
      );
    });

    it('should throw an error when a LPA without a name is found', () => {
      expect(() => getLpa(lpaCode)).rejects.toThrow(
        `Unable to find LPA email or name for code ${lpaCode}`
      );
    });

    it('should throw an error when a LPA without an email is found', () => {
      expect(() => getLpa(lpaCode)).rejects.toThrow(
        `Unable to find LPA email or name for code ${lpaCode}`
      );
    });
  });
});
