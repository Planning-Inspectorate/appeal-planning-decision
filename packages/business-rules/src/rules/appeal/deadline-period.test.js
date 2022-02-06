const deadlinePeriod = require('./deadline-period');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');

describe('business-rules/appeal/deadline-period', () => {
  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlinePeriod('100', APPLICATION_DECISION.REFUSED)).toThrow(
      '100 is not a valid appeal type',
    );
  });

  it('should throw an error if an invalid application decision is given', () => {
    expect(() => deadlinePeriod(APPEAL_ID.HOUSEHOLDER, '100')).toThrow(
      '100 is not a valid application decision',
    );
  });

  it('should return the correct dealine period for the householder appeal type', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.REFUSED);
    expect(time).toEqual(12);
    expect(duration).toEqual('weeks');
  });

  it('should return the correct dealine period for the householder appeal type', () => {
    const { duration, time } = deadlinePeriod(undefined, APPLICATION_DECISION.REFUSED);
    expect(time).toEqual(12);
    expect(duration).toEqual('weeks');
  });

  it('should return the correct dealine period for the householder appeal type', () => {
    const { duration, time } = deadlinePeriod(APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.GRANTED);
    expect(time).toEqual(6);
    expect(duration).toEqual('months');
  });

  it('should return the correct dealine period for the householder appeal type', () => {
    const { duration, time } = deadlinePeriod(
      APPEAL_ID.PLANNING_SECTION_78,
      APPLICATION_DECISION.GRANTED,
    );
    expect(time).toEqual(6);
    expect(duration).toEqual('months');
  });
});
