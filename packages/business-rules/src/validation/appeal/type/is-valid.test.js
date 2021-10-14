const isValid = require('./is-valid');
const { APPEAL_ID } = require('../../../constants');

describe('validation/appeal/type/is-valid', () => {
  it('should return true if a valid appeal type is given', () => {
    expect(isValid(APPEAL_ID.ENFORCEMENT_NOTICE)).toBeTruthy();
  });

  it('should return false if an invalid appeal type is given', () => {
    expect(isValid('100')).toBeFalsy();
  });
});
