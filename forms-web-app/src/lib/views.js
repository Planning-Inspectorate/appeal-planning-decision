const VIEW = {
  APPLICATION_NUMBER: 'application-number',

  SUBMISSION: 'submission',
  CONFIRMATION: 'confirmation',
  CHECK_ANSWERS: 'check-answers',

  ELIGIBILITY: {
    LISTED_BUILDING: 'eligibility/listed-building',
    LISTED_OUT: 'eligibility/listed-out',
    NO_DECISION: 'eligibility/no-decision',
    DECISION_DATE: 'eligibility/decision-date',
    DECISION_DATE_EXPIRED: 'eligibility/decision-date-expired',
    PLANNING_DEPARTMENT: 'eligibility/planning-department',
    PLANNING_DEPARTMENT_OUT: 'eligibility/planning-department-out',
    APPEAL_STATEMENT: 'eligibility/appeal-statement',
  },

  APPELLANT_SUBMISSION: {
    TASK_LIST: 'appellant-submission/task-list',
    APPEAL_STATEMENT: 'appellant-submission/appeal-statement',
    APPLICATION_NUMBER: 'appellant-submission/application-number',
    SITE_LOCATION: 'appellant-submission/site-location',
    SITE_OWNERSHIP: 'appellant-submission/site-ownership',
    SUPPORTING_DOCUMENTS: 'appellant-submission/supporting-documents',
    SITE_ACCESS: 'appellant-submission/site-access',
    SITE_ACCESS_SAFETY: 'appellant-submission/site-access-safety',
    YOUR_DETAILS: 'appellant-submission/your-details',
    WHO_ARE_YOU: 'appellant-submission/who-are-you',
    APPLICANT_NAME: 'appellant-submission/applicant-name',
    UPLOAD_APPLICATION: 'appellant-submission/upload-application',
    UPLOAD_DECISION: 'appellant-submission/upload-decision',
  },
};

module.exports = {
  VIEW,
  WHO_ARE_YOU: VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU,
  APPLICATION_NUMBER: VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER,
};
