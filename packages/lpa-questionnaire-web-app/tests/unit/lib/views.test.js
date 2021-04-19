const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      TASK_LIST: 'task-list',
      PLACEHOLDER: 'placeholder',
      OTHER_APPEALS: 'other-appeals',
      ACCURACY_SUBMISSION: 'accuracy-submission',
      EXTRA_CONDITIONS: 'extra-conditions',
      DEVELOPMENT_PLAN: 'development-plan',
      UPLOAD_PLANS: 'upload-plans',
      OFFICERS_REPORT: 'officers-report',
      INFORMATION_SUBMITTED: 'information-submitted',
    });
  });
});
