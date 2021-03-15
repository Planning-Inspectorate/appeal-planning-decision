const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      APPLICATION_NUMBER: 'application-number',

      COOKIES: 'cookies',

      ELIGIBILITY: {
        LISTED_BUILDING: 'eligibility/listed-building',
        LISTED_OUT: 'eligibility/listed-out',
        NO_DECISION: 'eligibility/no-decision',
        DECISION_DATE: 'eligibility/decision-date',
        DECISION_DATE_PASSED: 'eligibility/decision-date-passed',
        PLANNING_DEPARTMENT: 'eligibility/planning-department',
        PLANNING_DEPARTMENT_OUT: 'eligibility/planning-department-out',
        COSTS: 'eligibility/costs',
        COSTS_OUT: 'eligibility/costs-out',
        APPEAL_STATEMENT: 'eligibility/appeal-statement',
        ENFORCEMENT_NOTICE: 'eligibility/enforcement-notice',
        ENFORCEMENT_NOTICE_OUT: 'eligibility/enforcement-notice-out',
        HOUSEHOLDER_PLANNING_PERMISSION: 'eligibility/householder-planning-permission',
        HOUSEHOLDER_PLANNING_PERMISSION_OUT: 'eligibility/householder-planning-permission-out',
      },

      APPELLANT_SUBMISSION: {
        TASK_LIST: 'appeal-householder-decision/task-list',
        APPEAL_STATEMENT: 'appeal-householder-decision/appeal-statement',
        APPLICATION_NUMBER: 'appeal-householder-decision/application-number',
        SITE_LOCATION: 'appeal-householder-decision/site-location',
        SITE_OWNERSHIP: 'appeal-householder-decision/site-ownership',
        SITE_OWNERSHIP_CERTB: 'appeal-householder-decision/site-ownership-certb',
        SUPPORTING_DOCUMENTS: 'appeal-householder-decision/supporting-documents',
        SITE_ACCESS: 'appeal-householder-decision/site-access',
        SITE_ACCESS_SAFETY: 'appeal-householder-decision/site-access-safety',
        YOUR_DETAILS: 'appeal-householder-decision/your-details',
        WHO_ARE_YOU: 'appeal-householder-decision/who-are-you',
        APPLICANT_NAME: 'appeal-householder-decision/applicant-name',
        UPLOAD_APPLICATION: 'appeal-householder-decision/upload-application',
        UPLOAD_DECISION: 'appeal-householder-decision/upload-decision',
        CHECK_ANSWERS: 'appeal-householder-decision/check-answers',
        SUBMISSION: 'appeal-householder-decision/submission',
        CONFIRMATION: 'appeal-householder-decision/confirmation',
        SUBMISSION_INFORMATION: 'appeal-householder-decision/submission-information',
      },

      GUIDANCE_PAGES: {
        BEFORE_APPEAL: 'guidance-pages/before-appeal',
        WHEN_APPEAL: 'guidance-pages/when-appeal',
        AFTER_APPEAL: 'guidance-pages/after-appeal',
        START_APPEAL: 'guidance-pages/start-appeal',
        STAGES_APPEAL: 'guidance-pages/stages-appeal',
      },
    });
  });
});
