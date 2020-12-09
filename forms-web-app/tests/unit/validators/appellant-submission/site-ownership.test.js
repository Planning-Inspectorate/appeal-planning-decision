jest.mock('../../../../src/services/department.service');
const { rules } = require('../../../../src/validators/appellant-submission/site-ownership');

describe('validators/appellant-submission/site-ownership', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(0);
    });
  });
});
