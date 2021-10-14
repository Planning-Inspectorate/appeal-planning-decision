const index = require('./index');
const { isInThePast, isWithinDeadlinePeriod } = require('./appeal/decision-date');

describe('validators/index', () => {
  it(`should export the expected data shape`, () => {
    expect(index).toEqual({
      appeal: {
        decisionDate: {
          isInThePast,
          isWithinDeadlinePeriod,
        },
      },
    });
  });
});
