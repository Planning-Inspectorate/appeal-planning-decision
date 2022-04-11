const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      APPLICATION_NUMBER: 'application-number',

      OUT_OF_TIME_SHUTTER_PAGE: 'full-appeal/out-of-time-shutter-page',
      COOKIES: 'cookies',

      BEFORE_YOU_START: {
        USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE:
          'before-you-start/use-existing-service-enforcement-notice',
      },

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
        GRANTED_REFUSED_PERMISSION: 'eligibility/granted-or-refused-permission',
        GRANTED_REFUSED_PERMISSION_OUT: 'eligibility/granted-or-refused-permission-out',
      },

      APPELLANT_SUBMISSION: {
        TASK_LIST: 'appellant-submission/task-list',
        APPEAL_STATEMENT: 'appellant-submission/appeal-statement',
        APPLICATION_NUMBER: 'appellant-submission/application-number',
        SITE_LOCATION: 'appellant-submission/site-location',
        SITE_OWNERSHIP: 'appellant-submission/site-ownership',
        SITE_OWNERSHIP_CERTB: 'appellant-submission/site-ownership-certb',
        SUPPORTING_DOCUMENTS: 'appellant-submission/supporting-documents',
        SITE_ACCESS: 'appellant-submission/site-access',
        SITE_ACCESS_SAFETY: 'appellant-submission/site-access-safety',
        YOUR_DETAILS: 'appellant-submission/your-details',
        WHO_ARE_YOU: 'appellant-submission/who-are-you',
        APPLICANT_NAME: 'appellant-submission/applicant-name',
        UPLOAD_APPLICATION: 'appellant-submission/upload-application',
        UPLOAD_DECISION: 'appellant-submission/upload-decision',
        CHECK_ANSWERS: 'appellant-submission/check-answers',
        SUBMISSION: 'appellant-submission/submission',
        CONFIRMATION: 'appellant-submission/confirmation',
        SUBMISSION_INFORMATION: 'appellant-submission/submission-information',
      },

      GUIDANCE_PAGES: {
        BEFORE_APPEAL: 'guidance-pages/before-appeal',
        WHEN_APPEAL: 'guidance-pages/when-appeal',
        AFTER_APPEAL: 'guidance-pages/after-appeal',
        START_APPEAL: 'guidance-pages/start-appeal',
        STAGES_APPEAL: 'guidance-pages/stages-appeal',
      },

      FULL_APPEAL: {
        ANY_OF_FOLLOWING: 'full-appeal/any-of-following',
        DATE_DECISION_DUE: 'full-appeal/date-decision-due',
        DECISION_DATE: 'full-appeal/decision-date',
        ENFORCEMENT_NOTICE: 'full-appeal/enforcement-notice',
        GRANTED_OR_REFUSED: 'full-appeal/granted-or-refused',
        LOCAL_PLANNING_DEPARTMENT: 'full-appeal/local-planning-department',
        TYPE_OF_PLANNING_APPLICATION: 'full-appeal/type-of-planning-application',
        USE_A_DIFFERENT_SERVICE: 'full-appeal/use-a-different-service',
        YOU_CANNOT_APPEAL: 'full-appeal/you-cannot-appeal',
        PRIOR_APPROVAL_EXISTING_HOME: 'full-appeal/prior-approval-existing-home',
      },

      YOUR_PLANNING_APPEAL: {
        INDEX: 'your-planning-appeal/index',
        YOUR_APPEAL_DETAILS: 'your-planning-appeal/your-appeal-details',
      },

      MESSAGES: {
        COOKIES_UPDATED_SUCCESSFULLY: 'messages/cookies-updated-successfully',
      },
    });
  });
});
