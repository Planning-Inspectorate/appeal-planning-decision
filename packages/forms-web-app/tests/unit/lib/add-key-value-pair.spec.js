const addKeyValuePair = require('../../../src/lib/add-key-value-pair');

describe('lib/add-key-value-pair', () => {
  [
    {
      description: 'empty input',
      given: {
        dict: {},
        key: '',
        value: '',
      },
      expected: {},
    },
    {
      description: 'adds a key value pair',
      given: {
        dict: {},
        key: 'a',
        value: 'b',
      },
      expected: {
        a: 'b',
      },
    },
    {
      description: 'adds a key value pair - existing data',
      given: {
        dict: {
          c: 'd',
        },
        key: 'a',
        value: 'b',
      },
      expected: {
        a: 'b',
        c: 'd',
      },
    },
    {
      description: 'replaces key value if already set',
      given: {
        dict: {
          c: 'd',
        },
        key: 'c',
        value: 'b',
      },
      expected: {
        c: 'b',
      },
    },
  ].forEach(({ description, given: { dict, key, value }, expected }) => {
    it(`should give the expected output - ${description}`, () => {
      expect(addKeyValuePair(dict, key, value)).toEqual(expected);
    });
  });
});
