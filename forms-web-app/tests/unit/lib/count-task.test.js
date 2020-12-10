const countTasks = require('../../../src/lib/count-task');

describe('lib/count-task', () => {
  [
    {
      given: [{ items: [{ status: 'IN PROGRESS' }] }],
      expected: { nbTasks: 1, nbCompleted: 0 },
    },
    {
      given: [{ items: [{ status: 'COMPLETED' }] }],
      expected: { nbTasks: 1, nbCompleted: 1 },
    },
    {
      given: [{ items: [{ status: 'COMPLETED' }, { status: 'IN PROGRESS' }] }],
      expected: { nbTasks: 2, nbCompleted: 1 },
    },
    {
      given: [
        { items: [{ status: 'COMPLETED' }, { status: 'COMPLETED' }] },
        { items: [{ status: 'COMPLETED' }, { status: 'IN PROGRESS' }] },
      ],
      expected: { nbTasks: 4, nbCompleted: 3 },
    },
  ].forEach(({ given, expected }) => {
    it(`should display the expected file size - ${expected}`, () => {
      expect(countTasks(given)).toStrictEqual(expected);
    });
  });
});
