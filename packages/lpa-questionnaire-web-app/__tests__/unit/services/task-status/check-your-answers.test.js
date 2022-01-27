const {
  CANNOT_START_YET,
  NOT_STARTED,
  COMPLETED,
} = require('../../../../src/services/common/task-statuses');
const checkAnswersCompletion = require('../../../../src/services/task-status/check-your-answers');
const taskChecks = require('../../../../src/services/task-status/index');

jest.mock('../../../../src/services/task-status/index');

describe('services/task.service/task-status/check-your-answer', () => {
  it('should return null if no appeal reply passed', () => {
    expect(checkAnswersCompletion()).toBeNull();
  });

  it('should return completed if appeal reply is submitted', () => {
    const mockAppealReply = {
      state: 'SUBMITTED',
    };

    expect(checkAnswersCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return cannot start yet if not all tasks completed', () => {
    const mockAppealReply = {};

    expect(checkAnswersCompletion(mockAppealReply)).toEqual(CANNOT_START_YET);
  });

  it('should return not started if all tasks are completed and reply is not submitted', () => {
    const mockAppealReply = {};

    Object.values(taskChecks).forEach((check) => check.mockReturnValue(COMPLETED));

    expect(checkAnswersCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
