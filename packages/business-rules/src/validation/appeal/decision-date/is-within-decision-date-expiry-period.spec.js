const { subWeeks } = require('date-fns');
const isWithinDecisionDateExpiryPeriod = require('./is-within-decision-date-expiry-period');

describe('validation/appeal/decision-date/is-within-decision-date-expiry-period', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  [
    { givenDate: null, now: currentDate },
    { givenDate: currentDate, now: null },
    { givenDate: null, now: null },
  ].forEach(({ givenDate, now }) => {
    it('should throw if given invalid parameters', () => {
      expect(() => isWithinDecisionDateExpiryPeriod(givenDate, now)).toThrow(
        'The given date must be a valid Date instance',
      );
    });
  });

  it('should return true if the current date is before the deadline date', () => {
    expect(isWithinDecisionDateExpiryPeriod(currentDate, currentDate)).toBeTruthy();
  });

  it('should return false if the current date is after the deadline date', () => {
    expect(isWithinDecisionDateExpiryPeriod(subWeeks(currentDate, 15), currentDate)).toBeFalsy();
  });
});
