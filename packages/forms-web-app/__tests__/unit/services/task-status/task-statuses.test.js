const {
  CANNOT_START_YET,
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
  getStatusOfPath,
} = require('../../../../src/services/task-status/task-statuses');

describe('services/task-status/task-statuses', () => {
  it('should have the expected, defined constants', () => {
    expect(CANNOT_START_YET).toEqual('CANNOT START YET');
    expect(NOT_STARTED).toEqual('NOT STARTED');
    expect(IN_PROGRESS).toEqual('IN PROGRESS');
    expect(COMPLETED).toEqual('COMPLETED');
  });

  describe('#getStatusOfPath', () => {
    it('should return NOT_STARTED if first page is NOT_STARTED', () => {
      const path = [{ status: NOT_STARTED }];
      expect(getStatusOfPath(path)).toEqual(NOT_STARTED);
    });
    it('should return IN_PROGRESS if first page is COMPLETED but no all pages COMPLETED', () => {
      const path = [{ status: COMPLETED }, { status: COMPLETED }, { status: NOT_STARTED }];
      expect(getStatusOfPath(path)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if all pages COMPLETED', () => {
      const path = [{ status: COMPLETED }];
      expect(getStatusOfPath(path)).toEqual(COMPLETED);
      path.push({ status: COMPLETED }, { status: COMPLETED });
      expect(getStatusOfPath(path)).toEqual(COMPLETED);
    });
  });
});
