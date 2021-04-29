const { endOfDay, subDays, subWeeks } = require('date-fns');
const isDecisionDatePassed = require('../../../src/lib/is-decision-date-passed');

describe('lib/is-decision-date-passed', () => {
  const today = endOfDay(new Date());
  let appeal;

  describe('decision date', () => {
    test(`confirm that appeal date has not passed if the decision date was 2 weeks ago`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 2).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(false);
    });

    test(`confirm that appeal date has passed if the decision date was more than 12 weeks ago`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 13).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(true);
    });

    test(`confirm that appeal date has not passed if the decision date was exactly 12 weeks ago`, () => {
      appeal = {};
      appeal.decisionDate = subWeeks(endOfDay(today), 12).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(false);
    });

    test(`confirm that appeal date has passed if the decision date was exactly 12 weeks and 1 day ago`, () => {
      appeal = {};
      appeal.decisionDate = subDays(subWeeks(endOfDay(today), 12), 1).toISOString();
      expect(isDecisionDatePassed(appeal)).toEqual(true);
    });
  });
});
