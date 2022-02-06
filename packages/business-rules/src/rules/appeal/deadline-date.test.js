const { addWeeks, endOfDay, addMonths } = require('date-fns');
const deadlineDate = require('./deadline-date');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');

describe('business-rules/appeal/deadline-date', () => {
  it('should throw an error if an invalid date is given', () => {
    expect(() => deadlineDate(null, APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.REFUSED)).toThrow(
      'The given date must be a valid Date instance',
    );
  });

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), '100', APPLICATION_DECISION.REFUSED)).toThrow(
      '100 is not a valid appeal type',
    );
  });

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), APPEAL_ID.HOUSEHOLDER, '100')).toThrow(
      '100 must be a valid application decision',
    );
  });

  it('should return the correct date for an appeal type', () => {
    expect(deadlineDate(new Date(), APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.REFUSED)).toEqual(
      addWeeks(endOfDay(new Date()), 12),
    );
  });

  it('should return the correct date for an appeal type', () => {
    expect(deadlineDate(new Date(), undefined, APPLICATION_DECISION.REFUSED)).toEqual(
      addWeeks(endOfDay(new Date()), 12),
    );
  });

  it('should return the correct date for an appeal type', () => {
    expect(deadlineDate(new Date(), undefined, undefined)).toEqual(
      addWeeks(endOfDay(new Date()), 12),
    );
  });
  
  it('should return the correct date for an appeal type', () => {
    expect(deadlineDate(new Date(), APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.GRANTED)).toEqual(
      addMonths(endOfDay(new Date()), 6),
    );
  });

  it('should return the correct date for an appeal type', () => {
    expect(
      deadlineDate(new Date(), APPEAL_ID.PLANNING_SECTION_78, APPLICATION_DECISION.GRANTED),
    ).toEqual(addMonths(endOfDay(new Date()), 6));
  });
});
