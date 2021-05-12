const { addWeeks } = require('date-fns');

const isWithinDecisionDateExpiryPeriod = require('../../../src/validation/appeal/decision-date/is-within-decision-date-expiration-period');

describe('rules/appeal/decision-date/is-within-decision-date-expiration-period', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  [
    { givenDate: null, now: undefined },
    { givenDate: null, now: currentDate },
    { givenDate: undefined, now: currentDate },
    { givenDate: currentDate, now: null },
    { givenDate: null, now: null },
  ].forEach(({ givenDate, now }) => {
    it(`should throw if given invalid parameters`, () => {
      expect(() => isWithinDecisionDateExpiryPeriod(givenDate, now)).toThrow(
        'The given date must be a valid Date instance.',
      );
    });
  });

  it(`should return true if 'givenDate' is before 'now'`, () => {
    expect(isWithinDecisionDateExpiryPeriod(currentDate)).toBeTruthy();
  });

  it(`should return false if 'givenDate' is after 'now'`, () => {
    expect(isWithinDecisionDateExpiryPeriod(currentDate, addWeeks(currentDate, 13))).toBeFalsy();
  });
});
