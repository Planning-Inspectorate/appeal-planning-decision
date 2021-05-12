const { addDays, subDays } = require('date-fns');

const isInThePast = require('../../../../src/validation/generic/date/is-in-the-past');

describe('validation/generic/date/is-in-the-past', () => {
  [
    { givenDate: null, now: undefined },
    { givenDate: null, now: new Date() },
    { givenDate: undefined, now: new Date() },
    { givenDate: new Date(), now: null },
    { givenDate: null, now: null },
  ].forEach(({ givenDate, now }) => {
    it(`should throw if given invalid parameters`, () => {
      expect(() => isInThePast(givenDate, now)).toThrow(
        'The given date must be a valid Date instance.',
      );
    });
  });

  it(`should return true if 'givenDate' is before 'now'`, () => {
    expect(isInThePast(subDays(new Date(), 1))).toBeTruthy();
  });

  it(`should return true if 'givenDate' is after 'now'`, () => {
    expect(isInThePast(addDays(new Date(), 1))).toBeFalsy();
  });
});
