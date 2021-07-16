const { addYears, subYears } = require('date-fns');
const householderAppeal = require('./householder-appeal');

describe('schemas/householder-appeal', () => {
  const config = {};
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  it('should return true when given a valid date', async () => {
    const appeal = {
      decisionDate: currentDate,
    };

    const isValid = await householderAppeal.isValid(appeal, config);
    expect(isValid).toEqual(true);
  });

  it('should return false when given a future date', async () => {
    const appeal = {
      decisionDate: addYears(currentDate, 1),
    };
    const isValid = await householderAppeal.isValid(appeal, config);
    expect(isValid).toEqual(false);
  });

  it('should return false when the current date is after the deadline date', async () => {
    const appeal = {
      decisionDate: subYears(currentDate, 1),
    };
    const isValid = await householderAppeal.isValid(appeal, config);
    expect(isValid).toEqual(false);
  });
});
