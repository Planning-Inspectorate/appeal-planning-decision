const deadlineDate = require('./deadline-date');
const deadlinePeriod = require('./deadline-period');
const { APPEAL_ID } = require('../../constants');

describe('business-rules/appeal/deadline-period', () => {
  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), '100')).toThrow('100 is not a valid appeal type');
  });

  it('should return the correct date for the householder appeal type', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.HOUSEHOLDER);
    expect(time).toEqual(12);
    expect(duration).toEqual('weeks');
  });
});
