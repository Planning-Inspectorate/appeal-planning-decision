const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const booleanCompletion = require('../../../../src/services/task-status/boolean');

describe('services/task.service/task-status/accuracy-submission', () => {
  it('should return null if no appeal reply passed', () => {
    expect(booleanCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      mockTask: null,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is yes', () => {
    const mockAppealReply = {
      mockTask: true,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });

  it('should return completed if answer is no', () => {
    const mockAppealReply = {
      mockTask: false,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });
});
