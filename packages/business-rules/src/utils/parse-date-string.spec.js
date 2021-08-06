const parseDateString = require('./parse-date-string');

describe('utils/parse-date-string', () => {
  it('should return a valid string ISO format', () => {
    const date = parseDateString(null, '2022-01-01T12:00:00.000Z');
    expect(date).toEqual(new Date('2022-01-01T12:00:00.000Z'));
  });

  it('should return a valid date format', () => {
    const date = parseDateString(null, new Date('2022-01-01T12:00:00.000Z'));
    expect(date).toEqual(new Date('2022-01-01T12:00:00.000Z'));
  });

  it('should throw an error when given an invalid date', () => {
    expect(() => parseDateString(null, '2022-01-01')).toThrow(
      'Invalid Date or string not ISO format',
    );
  });

  it('should throw an error when given an invalid string', () => {
    expect(() => parseDateString(null, 'Today')).toThrow('Invalid Date or string not ISO format');
  });
});
