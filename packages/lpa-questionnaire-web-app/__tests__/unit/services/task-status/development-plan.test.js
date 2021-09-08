const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const developmentPlanCompletion = require('../../../../src/services/task-status/development-plan');

describe('services/task.service/task-status/other-appeals', () => {
  it('should return null if no appeal reply passed', () => {
    expect(developmentPlanCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    const mockAppealReply = {
      optionalDocumentsSection: {
        developmentOrNeighbourhood: {
          hasPlanSubmitted: null,
          planChanges: '',
        },
      },
    };

    expect(developmentPlanCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is no', () => {
    const mockAppealReply = {
      optionalDocumentsSection: {
        developmentOrNeighbourhood: {
          hasPlanSubmitted: false,
          planChanges: '',
        },
      },
    };

    expect(developmentPlanCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return completed if answer is yes and text is passed.', () => {
    const mockAppealReply = {
      optionalDocumentsSection: {
        developmentOrNeighbourhood: {
          hasPlanSubmitted: true,
          planChanges: 'some-text',
        },
      },
    };

    expect(developmentPlanCompletion(mockAppealReply)).toEqual(COMPLETED);
  });

  it('should return not started if answer is yes and no text is passed', () => {
    const mockAppealReply = {
      optionalDocumentsSection: {
        developmentOrNeighbourhood: {
          hasPlanSubmitted: null,
          planChanges: '',
        },
      },
    };

    expect(developmentPlanCompletion(mockAppealReply)).toEqual(NOT_STARTED);
  });
});
