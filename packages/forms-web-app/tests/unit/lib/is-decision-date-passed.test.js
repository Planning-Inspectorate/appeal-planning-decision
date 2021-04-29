const { endOfDay, subDays, subWeeks } = require('date-fns');
const isDecisionDatePassed = require('../../../src/lib/is-decision-date-passed');

describe('lib/is-decision-date-passed', () => {
  const today = endOfDay(new Date());
  let appeal;

  describe('decision date', () => {
    test(`confirm if decision date has not passed`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 2).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(false);
    });

    test(`confirm if decision date has passed`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 13).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(true);
    });

    test(`confirm if decision date has not passed exactly 12 weeks ago`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 12).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(false);
    });

    test(`confirm if decision date has not passed exactly 12 weeks and 1 day ago`, () => {
      appeal = {};
      appeal.decisionDate = subDays(subWeeks(endOfDay(today), 12), 1).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(true);
    });
  });
});
