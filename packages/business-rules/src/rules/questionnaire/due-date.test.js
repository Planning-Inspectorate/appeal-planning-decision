const { parseISO } = require('date-fns');
const dueDate = require('./due-date');
const { APPEAL_ID } = require('../../constants');

describe('business-rules/questionnaire/due-date', () => {
  let mockAppeal;
  const newDate = parseISO('2021-08-19T13:16:02.038Z');

  beforeEach(() => {
    mockAppeal = { submissionDate: newDate };
  });

  it('should throw an error if an invalid date is given', () => {
    mockAppeal = { submissionDate: null };
    expect(() => dueDate(mockAppeal)).toThrow('The given date must be a valid Date instance');
  });

  it('should throw an error if an invalid appeal type is given', () => {
    expect(() => dueDate(mockAppeal, '100')).toThrow('100 is not a valid appeal type');
  });

  it('should return the correct date for an appeal type', () => {
    expect(dueDate(mockAppeal, APPEAL_ID.HOUSEHOLDER)).toEqual(
      parseISO('2021-08-26T23:59:59.999Z'),
    );
  });

  it('should return the correct date for an appeal type, including a bank holiday', () => {
    mockAppeal = { submissionDate: parseISO('2021-08-26T13:16:02.038Z') };
    expect(dueDate(mockAppeal, APPEAL_ID.HOUSEHOLDER)).toEqual(
      parseISO('2021-09-03T23:59:59.999Z'),
    );
  });
});
