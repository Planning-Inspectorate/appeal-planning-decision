const isValid = require('./is-valid');
const { APPLICATION_DECISION } = require('../../../constants');

describe('validation/appeal/application-decision/is-valid', () => {
  it('should return true if a valid application decision is given', () => {
    expect(isValid(APPLICATION_DECISION.GRANTED)).toBeTruthy();
  });

  it('should return false if an invalid application decision is given', () => {
    expect(isValid('100')).toBeFalsy();
  });
});
