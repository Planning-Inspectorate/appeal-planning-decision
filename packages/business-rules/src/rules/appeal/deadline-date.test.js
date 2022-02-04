const { addWeeks, endOfDay, addMonths } = require('date-fns');
const deadlineDate = require('./deadline-date');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');

describe('business-rules/appeal/deadline-date', () => {
  it('should throw an error if an invalid date is given', () => {
    expect(() => deadlineDate(null)).toThrow('The given date must be a valid Date instance');
  });

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => deadlineDate(new Date(), '100')).toThrow('100 is not a valid appeal type');
  });

  it('should return the correct date for an full planning appeal type', () => {
    expect(deadlineDate(new Date(), APPEAL_ID.PLANNING_SECTION_78)).toEqual(
      addMonths(endOfDay(new Date()), 6),
    );
  });

  [
    {
      appealType: APPEAL_ID.HOUSEHOLDER,
      decision: APPLICATION_DECISION.GRANTED,
      months: 6,
    },
    {
      appealType: APPEAL_ID.HOUSEHOLDER,
      decision: APPLICATION_DECISION.REFUSED,
      weeks: 12,
    },
    {
      appealType: APPEAL_ID.HOUSEHOLDER,
      decision: APPLICATION_DECISION.NODECISIONRECEIVED,
      months: 6,
    },
    {
      appealType: APPEAL_ID.HOUSEHOLDER,
      decision: undefined,
      months: 6,
    },
  ].forEach(({ appealType, decision, months, weeks }) => {
    it('should throw if given invalid parameters', () => {
      if (months) {
        expect(deadlineDate(new Date(), appealType, decision)).toEqual(
          addMonths(endOfDay(new Date()), months),
        );
      }

      if (weeks) {
        expect(deadlineDate(new Date(), appealType, decision)).toEqual(
          addWeeks(endOfDay(new Date()), weeks),
        );
      }
    });
  });

  it('should return the correct date for an householder appeal type', () => {
    expect(deadlineDate(new Date(), APPEAL_ID.HOUSEHOLDER, APPLICATION_DECISION.REFUSED)).toEqual(
      addWeeks(endOfDay(new Date()), 12),
    );
  });
});
