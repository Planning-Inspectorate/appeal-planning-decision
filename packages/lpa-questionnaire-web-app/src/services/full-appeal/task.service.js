const TASK_STATUS = require('../common/task-statuses');

const TASK_SCOPE = {
  DETERMINISTIC: 'deterministic',
  NON_DETERMINISTIC: 'nondeterministic',
  GENERIC: 'generic',
};

const SECTIONS = {
  procedureTypeReview: {
    displayText: 'Review the procedure type',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  issuesConstraintsDesignation: {
    displayText: 'Tell us about constraints, designations and other issues',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  environmentalImpactAssessment: {
    displayText: "Tell us if it's an environmental impact assessment development",
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  peoplNotification: {
    displayText: 'Tell us how you notified people about the application',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  consultationResponse: {
    displayText: 'Upload consultation responses and representations',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  planningOfficerReport: {
    displayText: "Upload the Planning Officer's report and relevant policies",
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
    scope: TASK_SCOPE.DETERMINISTIC,
  },
  decisionNotice: {
    displayText: 'Tell us what your decision notice would have said and provide relevant policies',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
    scope: TASK_SCOPE.NON_DETERMINISTIC,
  },
  siteAccess: {
    displayText: 'Tell the Inspector about site access',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  additionalInformation: {
    displayText: 'Provide additional information for the Inspector',
    href: '',
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  questionnaireSubmission: {
    displayText: 'Check your answers and submit',
    href: '',
    rule: () => TASK_STATUS.CANNOT_START_YET,
  },
};

const getTaskStatus = (questionnaire, section, taskName, sections = SECTIONS) => {
  try {
    const { rule } = taskName ? sections[section][taskName] : sections[section];
    return rule(questionnaire);
  } catch (e) {
    return null;
  }
};

module.exports = { SECTIONS, getTaskStatus, TASK_SCOPE };
