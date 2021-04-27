const getYourPlanningAppealLink = require('../../../src/lib/get-your-planning-appeal-link');

describe('lib/get-your-planning-appeal-link', () => {
  ['a', 'bb', 123456789, 'zxc-qwe'].forEach((input) => {
    it(`should return the expected link - ${input}`, () => {
      expect(getYourPlanningAppealLink({ id: input })).toEqual(`/your-planning-appeal/${input}`);
    });
  });
});
