const deadlineDate = require('./deadline-date');
const deadlinePeriod = require('./deadline-period');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');

describe('business-rules/appeal/deadline-period', () => {
  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), '100')).toThrow('100 is not a valid appeal type');
  });

  it('should return the correct date for the householder appeal type with a granted decision', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.GRANTED);
    expect(time).toEqual(6);
    expect(duration).toEqual('months');
  });

  it('should return the correct date for the householder appeal type with a refused decision', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.REFUSED);
    expect(time).toEqual(12);
    expect(duration).toEqual('weeks');
  });

  it('should return the correct date for the householder appeal type with no decision made', () => {
    const { duration, time } = deadlinePeriod(
      APPEAL_ID.HOUSEHOLDER,
      APPLICATION_DECISION.NODECISIONRECEIVED,
    );
    expect(time).toEqual(6);
    expect(duration).toEqual('months');
  });

  it('should return the correct date for the full planning appeal type', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.PLANNING_SECTION_78);
    expect(time).toEqual(6);
    expect(duration).toEqual('months');
  });
});
