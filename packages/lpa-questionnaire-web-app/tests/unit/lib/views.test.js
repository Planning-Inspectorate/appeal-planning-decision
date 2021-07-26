const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      TASK_LIST: 'task-list',
      PLACEHOLDER: 'placeholder',
      OTHER_APPEALS: 'other-appeals',
      ACCURACY_SUBMISSION: 'accuracy-submission',
      EXTRA_CONDITIONS: 'extra-conditions',
      INTERESTED_PARTIES: 'interested-parties',
      HEALTH_SAFETY: 'health-safety',
      REPRESENTATIONS: 'representations',
      NOTIFYING_PARTIES: 'notifying-parties',
      DEVELOPMENT_PLAN: 'development-plan',
      UPLOAD_PLANS: 'upload-plans',
      OFFICERS_REPORT: 'officers-report',
      SITE_NOTICES: 'site-notices',
      CONSERVATION_AREA_MAP: 'conservation-area-map',
      PLANNING_HISTORY: 'planning-history',
      OTHER_POLICIES: 'other-policies',
      STATUTORY_DEVELOPMENT: 'statutory-development',
      SUPPLEMENTARY_DOCUMENTS: {
        UPLOADED_DOCUMENTS: 'supplementary-documents/uploaded-documents',
        DELETE_DOCUMENT: 'supplementary-documents/delete-document',
        ADD_DOCUMENT: 'supplementary-documents/add-document',
      },
      INFORMATION_SUBMITTED: 'information-submitted',
      CONFIRM_ANSWERS: 'confirm-answers',
      PDF_GENERATION: 'pdf-generation',
    });
  });
});
