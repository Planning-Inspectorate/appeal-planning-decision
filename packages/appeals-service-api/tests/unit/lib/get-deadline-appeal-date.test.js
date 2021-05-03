const { addWeeks, endOfDay, parseISO, subWeeks } = require('date-fns');
const getDeadlineAppealDate = require('../../../src/lib/get-deadline-appeal-date');

describe('lib/get-deadline-appeal-date', () => {
  const today = endOfDay(new Date());
  let decisionDate;

  describe('deadline date', () => {
    test(`should return correct deadline if todays date is given`, () => {
      decisionDate = endOfDay(today).toISOString();
      expect(getDeadlineAppealDate(parseISO(decisionDate))).toEqual(
        addWeeks(endOfDay(parseISO(decisionDate)), 12)
      );
    });

    test(`should return correct deadline if given two weeks old date`, () => {
      decisionDate = subWeeks(endOfDay(today), 2).toISOString();
      expect(getDeadlineAppealDate(parseISO(decisionDate))).toEqual(
        addWeeks(endOfDay(parseISO(decisionDate)), 12)
      );
    });

    test(`should return correct deadline if given expired date (more than 12 weeks old)`, () => {
      decisionDate = subWeeks(endOfDay(today), 13).toISOString();
      expect(getDeadlineAppealDate(parseISO(decisionDate))).toEqual(
        addWeeks(endOfDay(parseISO(decisionDate)), 12)
      );
    });
  });
});