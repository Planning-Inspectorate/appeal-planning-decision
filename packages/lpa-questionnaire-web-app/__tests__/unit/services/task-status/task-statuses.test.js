const {
  CANNOT_START_YET,
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../src/services/common/task-statuses');

describe('services/task-status/task-statuses', () => {
  it('should have the expected, defined constants', () => {
    expect(CANNOT_START_YET).toEqual('CANNOT START YET');
    expect(NOT_STARTED).toEqual('NOT STARTED');
    expect(IN_PROGRESS).toEqual('IN PROGRESS');
    expect(COMPLETED).toEqual('COMPLETED');
  });
});
