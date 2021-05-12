const deadlineDate = require('./deadline-date');

describe('business-rules/appeal/deadline-date', () => {
  it(`should throw if the given 'decisionDate' is not a valid date`, () => {
    expect(() => deadlineDate(null)).toThrow('The given date must be a valid Date instance.');
  });

  it(`should throw if the given 'expiryPeriodInWeeks' is not a number`, () => {
    expect(() => deadlineDate(new Date(), 'hello world')).toThrow(
      `The 'expiryPeriodInWeeks' parameter must be a positive number.`,
    );
  });

  it(`should throw if the given 'expiryPeriodInWeeks' is a negative number`, () => {
    expect(() => deadlineDate(new Date(), -3)).toThrow(
      `The 'expiryPeriodInWeeks' parameter must be a positive number.`,
    );
  });

  [
    {
      decisionDate: new Date('2021-01-01T07:20:12.595Z'),
      expiryPeriodInWeeks: undefined,
      expectedOutcome: new Date('2021-03-26T23:59:59.999Z'),
    },
    {
      decisionDate: new Date('2021-01-01T07:20:12.595Z'),
      expiryPeriodInWeeks: 12,
      expectedOutcome: new Date('2021-03-26T23:59:59.999Z'),
    },
    {
      decisionDate: new Date('2021-01-01T07:20:12.595Z'),
      expiryPeriodInWeeks: 1,
      expectedOutcome: new Date('2021-01-08T23:59:59.999Z'),
    },
    {
      decisionDate: new Date('2021-01-01T00:00:00.000Z'),
      expiryPeriodInWeeks: 52,
      expectedOutcome: new Date('2021-12-31T23:59:59.999Z'),
    },
  ].forEach(({ decisionDate, expiryPeriodInWeeks, expectedOutcome }) => {
    it(`should return ${expectedOutcome.toISOString()} for the ${expiryPeriodInWeeks} week expiry period, when the decision date is ${decisionDate.toISOString()}`, () => {
      expect(deadlineDate(decisionDate, expiryPeriodInWeeks)).toEqual(expectedOutcome);
    });
  });
});
