const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const accuracySubmissionCompletion = require('../../../../src/services/task-status/accuracy-submission');

describe('services/task.service/task-status/accuracy-submission', () => {
  it('should return null if no appeal reply passed', () => {
    expect(accuracySubmissionCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        submissionAccuracy: {
          accurateSubmission: null,
          inaccuracyReason: '',
        },
      },
    };

    expect(accuracySubmissionCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is yes', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        submissionAccuracy: {
          accurateSubmission: true,
          inaccuracyReason: '',
        },
      },
    };

    expect(accuracySubmissionCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return completed if answer is no and reason is set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        submissionAccuracy: {
          accurateSubmission: false,
          inaccuracyReason: 'mock reason',
        },
      },
    };

    expect(accuracySubmissionCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return not started if answer is no and reason is not set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        submissionAccuracy: {
          accurateSubmission: false,
          inaccuracyReason: '',
        },
      },
    };

    expect(accuracySubmissionCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
