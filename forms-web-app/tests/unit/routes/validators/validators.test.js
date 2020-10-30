const moment = require('moment');

const {
  decisionDateCombiner,
  deadlineDateValidator,
} = require('../../../../src/routes/validators/validator');

describe('Test decisionDateCombiner', () => {
  it('Test that day, month, year combines correctly', () => {
    const mockReq = () => {
      return {
        body: {
          'decision-date-day': 12,
          'decision-date-month': 12,
          'decision-date-year': 2011,
        },
      };
    };

    const result = decisionDateCombiner(12, { req: mockReq() });

    expect(result).toEqual('2011-12-12');
  });
});

describe('Test deadlineDateValidator', () => {
  it('Test that if the deadline date has passed, an error is thrown', () => {
    const deadlineDate = moment('2011-12-12', 'Y-M-D', true);

    try {
      deadlineDateValidator(deadlineDate);
    } catch (error) {
      expect(error).toEqual(new Error('Deadline date has passed'));
    }
  });
});
