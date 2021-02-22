const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      TASK_LIST: 'task-list',
      PLACEHOLDER: 'placeholder',
      OTHER_APPEALS: 'other-appeals',
      EXTRA_CONDITIONS: 'extra-conditions',
    });
  });
});
