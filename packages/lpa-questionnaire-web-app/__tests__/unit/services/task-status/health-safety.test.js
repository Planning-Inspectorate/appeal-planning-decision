const { NOT_STARTED, COMPLETED } = require('../../../../src/services/common/task-statuses');
const healthSafetyCompletion = require('../../../../src/services/task-status/health-safety');

describe('services/task.service/task-status/other-appeals', () => {
  it('should return null if no appeal reply passed', () => {
    expect(healthSafetyCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      healthSafety: {
        hasHealthSafety: null,
        healthSafetyIssues: '',
      },
    };

    expect(healthSafetyCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is no', () => {
    const mockAppealReply = {
      healthSafety: {
        hasHealthSafety: false,
        healthSafetyIssues: '',
      },
    };

    expect(healthSafetyCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return completed if answer is yes and text is passed.', () => {
    const mockAppealReply = {
      healthSafety: {
        hasHealthSafety: true,
        healthSafetyIssues: 'some-text',
      },
    };

    expect(healthSafetyCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return not started if answer is yes and no text is passed', () => {
    const mockAppealReply = {
      healthSafety: {
        hasHealthSafety: true,
        healthSafetyIssues: '',
      },
    };

    expect(healthSafetyCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
