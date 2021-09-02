const filterByKey = require('../../../src/lib/filter-by-key');

describe('lib/filter-by-key', () => {
  [
    {
      description: 'empty input',
      given: {
        dict: {},
        key: '',
      },
      expected: {},
    },
    {
      description: 'no match',
      given: {
        dict: {
          a: 'b',
        },
        key: 'x',
      },
      expected: {
        a: 'b',
      },
    },
    {
      description: 'no match, several keys',
      given: {
        dict: {
          a: 'b',
          c: 'd',
          e: 'f',
        },
        key: 'x',
      },
      expected: {
        a: 'b',
        c: 'd',
        e: 'f',
      },
    },
    {
      description: 'with match',
      given: {
        dict: {
          a: 'b',
          c: 'd',
          e: 'f',
        },
        key: 'c',
      },
      expected: {
        a: 'b',
        e: 'f',
      },
    },
  ].forEach(({ description, given: { dict, key }, expected }) => {
    it(`should give the expected output - ${description}`, () => {
      expect(filterByKey(dict, key)).toEqual(expected);
    });
  });
});
