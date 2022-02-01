const taskStatuses = require('../../../../src/services/common/task-statuses');

describe('services/common/task-statuses', () => {
  it('should have expected defined constants', () => {
    expect(taskStatuses).toEqual({
      CANNOT_START_YET: 'CANNOT START YET',
      NOT_STARTED: 'NOT STARTED',
      IN_PROGRESS: 'IN PROGRESS',
      COMPLETED: 'COMPLETED',
    });
  });
});
