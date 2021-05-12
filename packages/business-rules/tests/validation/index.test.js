const index = require('../../src/validation');

const isWithinDecisionDateExpiryPeriod = require('../../src/validation/appeal/decision-date/is-within-decision-date-expiration-period');
const dateIsInThePast = require('../../src/validation/generic/date/is-in-the-past');

describe('validation/index', () => {
  it(`should export the expected data shape`, () => {
    expect(index).toEqual({
      appeal: {
        decisionDate: {
          isWithinDecisionDateExpiryPeriod,
        },
      },
      generic: {
        date: {
          isInThePast: dateIsInThePast,
        },
      },
    });
  });
});
