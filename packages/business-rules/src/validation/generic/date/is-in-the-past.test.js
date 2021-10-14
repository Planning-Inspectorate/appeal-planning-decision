const { addDays, subDays } = require('date-fns');
const isInThePast = require('./is-in-the-past');

describe('validation/generic/date/is-in-the-past', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  [
    { givenDate: null, now: currentDate },
    { givenDate: currentDate, now: null },
    { givenDate: null, now: null },
  ].forEach(({ givenDate, now }) => {
    it(`should throw if given invalid parameters`, () => {
      expect(() => isInThePast(givenDate, now)).toThrow(
        'The given date must be a valid Date instance',
      );
    });
  });

  it(`should return true if the given date is before the current date`, () => {
    expect(isInThePast(subDays(currentDate, 1), currentDate)).toBeTruthy();
  });

  it(`should return true if the given date is after the current date`, () => {
    expect(isInThePast(addDays(currentDate, 1), currentDate)).toBeFalsy();
  });
});
