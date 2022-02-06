const { subWeeks, add } = require('date-fns');
const isWithinDecisionDateExpiryPeriod = require('./is-within-decision-date-expiry-period');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../../constants');

describe('validation/appeal/decision-date/is-within-decision-date-expiry-period', () => {
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  [
    { givenDate: null, now: currentDate },
    { givenDate: currentDate, now: null },
    { givenDate: null, now: null },
  ].forEach(({ givenDate, now }) => {
    it('should throw if given invalid parameters', () => {
      expect(() => isWithinDecisionDateExpiryPeriod(givenDate, now)).toThrow(
        'The given date must be a valid Date instance',
      );
    });
  });

  it('should return true if the current date is before the deadline date', () => {
    expect(
      isWithinDecisionDateExpiryPeriod(
        currentDate,
        APPEAL_ID.HOUSEHOLDER,
        APPLICATION_DECISION.REFUSED,
        currentDate,
      ),
    ).toBeTruthy();
  });

  it('should return false if the current date is after the deadline date', () => {
    expect(
      isWithinDecisionDateExpiryPeriod(
        subWeeks(currentDate, 15),
        APPEAL_ID.HOUSEHOLDER,
        APPLICATION_DECISION.REFUSED,
        currentDate,
      ),
    ).toBeFalsy();
  });

  describe('if decision date is 12 weeks ago from today then it...', () => {
    const decisionDate = subWeeks(new Date(), 12);

    it('should return true if today is before deadline date', () => {
      expect(
        isWithinDecisionDateExpiryPeriod(
          decisionDate,
          APPEAL_ID.HOUSEHOLDER,
          APPLICATION_DECISION.REFUSED,
        ),
      ).toBeTruthy();
    });

    it('should return false if tomorrow is after deadline date', () => {
      const tomorrow = add(currentDate, {
        days: 1,
      });
      expect(
        isWithinDecisionDateExpiryPeriod(
          decisionDate,
          APPEAL_ID.HOUSEHOLDER,
          APPLICATION_DECISION.REFUSED,
          tomorrow,
        ),
      ).toBeFalsy();
    });
  });
});
