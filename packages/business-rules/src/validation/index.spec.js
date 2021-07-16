const index = require('./index');
const isWithinDecisionDateExpiryPeriod = require('./appeal/decision-date/is-within-decision-date-expiry-period');
const isInThePast = require('./generic/date/is-in-the-past');
const isValid = require('./appeal/type/is-valid');

describe('validation/index', () => {
  it(`should export the expected data shape`, () => {
    expect(index).toEqual({
      appeal: {
        decisionDate: {
          isWithinDecisionDateExpiryPeriod,
        },
        type: {
          isValid,
        },
      },
      generic: {
        date: {
          isInThePast,
        },
      },
    });
  });
});
