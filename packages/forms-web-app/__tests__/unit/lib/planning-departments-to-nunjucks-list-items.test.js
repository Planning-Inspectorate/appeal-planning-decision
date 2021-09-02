const {
  departmentsToNunjucksItems,
} = require('../../../src/lib/planning-departments-to-nunjucks-list-items');

describe('lib/planning-departments-to-nunjucks-list-items', () => {
  describe('departmentsToNunjucksItems', () => {
    [
      {
        description: 'empty list',
        given: {
          departments: [],
          appealLPD: '',
        },
        expected: [
          {
            value: undefined,
            text: undefined,
            selected: false,
          },
        ],
      },
      {
        description: 'one item, not selected',
        given: {
          departments: ['abc'],
          appealLPD: '',
        },
        expected: [
          {
            value: undefined,
            text: undefined,
            selected: false,
          },
          {
            value: 'abc',
            text: 'abc',
            selected: false,
          },
        ],
      },
      {
        description: 'two items, invalid selection',
        given: {
          departments: ['abc', 'xyz'],
          appealLPD: '123',
        },
        expected: [
          {
            value: undefined,
            text: undefined,
            selected: false,
          },
          {
            value: 'abc',
            text: 'abc',
            selected: false,
          },
          {
            value: 'xyz',
            text: 'xyz',
            selected: false,
          },
        ],
      },
      {
        description: 'three items, valid selection',
        given: {
          departments: ['abc', 'def', 'xyz'],
          appealLPD: 'def',
        },
        expected: [
          {
            value: undefined,
            text: undefined,
            selected: false,
          },
          {
            value: 'abc',
            text: 'abc',
            selected: false,
          },
          {
            value: 'def',
            text: 'def',
            selected: true,
          },
          {
            value: 'xyz',
            text: 'xyz',
            selected: false,
          },
        ],
      },
    ].forEach(({ description, given: { departments, appealLPD }, expected }) => {
      it(`should return the expected items list - ${description}`, () => {
        expect(departmentsToNunjucksItems(departments, appealLPD)).toEqual(expected);
      });
    });
  });
});
