const countTasks = require('../../../src/lib/count-task');

describe('lib/count-task', () => {
  [
    {
      description: 'One section, one task in progress',
      given: [{ items: [{ status: 'IN PROGRESS' }] }],
      expected: { nbTasks: 1, nbCompleted: 0, sections: { count: 1, completed: 0 } },
    },
    {
      description: 'One section, one task completed',
      given: [{ items: [{ status: 'COMPLETED' }] }],
      expected: { nbTasks: 1, nbCompleted: 1, sections: { count: 1, completed: 1 } },
    },
    {
      description: 'One section, two tasks, one completed, one in progress',
      given: [{ items: [{ status: 'COMPLETED' }, { status: 'IN PROGRESS' }] }],
      expected: { nbTasks: 2, nbCompleted: 1, sections: { count: 1, completed: 0 } },
    },
    {
      description: 'Two sections, two tasks each, all but one completed',
      given: [
        { items: [{ status: 'COMPLETED' }, { status: 'COMPLETED' }] },
        { items: [{ status: 'COMPLETED' }, { status: 'IN PROGRESS' }] },
      ],
      expected: { nbTasks: 4, nbCompleted: 3, sections: { count: 2, completed: 1 } },
    },
  ].forEach(({ description, given, expected }) => {
    it(`should return the counted tasks - ${description}`, () => {
      expect(countTasks(given)).toStrictEqual(expected);
    });
  });
});
