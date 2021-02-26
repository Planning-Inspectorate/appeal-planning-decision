const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const extraConditionsCompletion = require('../../../../src/services/task-status/extra-conditions');

describe('services/task.service/task-status/other-appeals', () => {
  it('should return null if no appeal reply passed', () => {
    expect(extraConditionsCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        extraConditions: {
          hasExtraConditions: null,
          extraConditions: '',
        },
      },
    };

    expect(extraConditionsCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is no', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        extraConditions: {
          hasExtraConditions: false,
          extraConditions: '',
        },
      },
    };

    expect(extraConditionsCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return completed if answer is yes and text is passed.', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        extraConditions: {
          hasExtraConditions: true,
          extraConditions: 'some-text',
        },
      },
    };

    expect(extraConditionsCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return not started if answer is yes and no text is passed', () => {
    const mockAppealReply = {
      aboutAppealSection: {
        extraConditions: {
          hasExtraConditions: null,
          extraConditions: '',
        },
      },
    };

    expect(extraConditionsCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
