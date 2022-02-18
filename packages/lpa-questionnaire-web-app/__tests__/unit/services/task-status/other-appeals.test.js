const { NOT_STARTED, COMPLETED } = require('../../../../src/services/common/task-statuses');
const otherAppealsCompletion = require('../../../../src/services/task-status/other-appeals');

describe('services/task.service/task-status/other-appeals', () => {
  it('should return null if no appeal reply passed', () => {
    expect(otherAppealsCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        otherAppeals: {
          adjacentAppeals: null,
          appealReferenceNumbers: '',
        },
      },
    };

    expect(otherAppealsCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is no', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        otherAppeals: {
          adjacentAppeals: false,
          appealReferenceNumbers: '',
        },
      },
    };

    expect(otherAppealsCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return completed if answer is yes and ref numbers are set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        otherAppeals: {
          adjacentAppeals: true,
          appealReferenceNumbers: 'abc-123',
        },
      },
    };

    expect(otherAppealsCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return not started if answer is yes and ref numbers are not set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        otherAppeals: {
          adjacentAppeals: true,
          appealReferenceNumbers: '',
        },
      },
    };

    expect(otherAppealsCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
