const { addWeeks, endOfDay } = require('date-fns');
const deadlineDate = require('./deadline-date');
const { APPEAL_ID } = require('../../constants');

describe('business-rules/appeal/deadline-date', () => {
  it('should throw an error if an invalid date is given', () => {
    expect(() => deadlineDate(null)).toThrow('The given date must be a valid Date instance');
  });

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), '100')).toThrow('100 is not a valid appeal type');
  });

  it('should return the correct date for an appeal type', () => {
    expect(deadlineDate(new Date(), APPEAL_ID.HOUSEHOLDER)).toEqual(
      addWeeks(endOfDay(new Date()), 12),
    );
  });
});
