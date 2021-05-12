const isValid = require('../../../../src/validation/generic/date/is-valid');

describe('validation/generic/date/is-valid', () => {
  it(`should return true if given a valid date`, () => {
    expect(isValid(new Date())).toBeTruthy();
  });

  it(`should throw if given an invalid date`, () => {
    expect(() => isValid(null)).toThrow('The given date must be a valid Date instance.');
  });
});
