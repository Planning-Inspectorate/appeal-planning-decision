const parseDateString = require('../../../src/lib/parse-date-string');

describe('lib/parse-date-string', () => {
  [
    {
      description: 'Valid string ISO format',
      given: '2022-01-01T12:00:00.000Z',
      expected: new Date('2022-01-01T12:00:00.000Z'),
    },
    {
      description: 'Valid date format',
      given: new Date('2022-01-01T12:00:00.000Z'),
      expected: new Date('2022-01-01T12:00:00.000Z'),
    },
    {
      description: 'Invalid string ISO format',
      given: '2022-01-01',
      expected: new Error('Invalid Date or string not ISO format'),
    },
    {
      description: 'Two sections, two tasks each, all but one completed',
      given: 'Today',
      expected: new Error('Invalid Date or string not ISO format'),
    },
  ].forEach(({ description, given, expected }) => {
    it(`should return the counted tasks - ${description}`, () => {
      expect(parseDateString(null, given)).toStrictEqual(expected);
    });
  });
});
