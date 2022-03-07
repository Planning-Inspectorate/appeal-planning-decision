const { VIEW } = require('../lib/views');
const {
  VIEW: { FULL_APPEAL },
} = require('../lib/full-appeal/views');
const TASK_STATUS = require('./task-status/task-statuses');
const { statusAppealSiteAddress } = require('./task-status/status-appeal-site-address');
const { statusSiteOwnership } = require('./task-status/status-site-ownership');
const { statusYourDetails } = require('./task-status/status-your-details');
const { statusContactDetails } = require('./task-status/full-appeal/status-contact-details');
const { statusAppealSiteSection } = require('./task-status/full-appeal/status-appeal-site-section');
const {
  statusAppealDecisionSection,
} = require('./task-status/full-appeal/status-appeal-decision-section');

function statusAppealStatement(appeal) {
  const task = appeal.yourAppealSection.appealStatement;
  return task.uploadedFile.id ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusSupportingDocuments(appeal) {
  const task = appeal.yourAppealSection.otherDocuments;
  return task.uploadedFiles.length > 0 ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusOriginalApplication(appeal) {
  const task = appeal.requiredDocumentsSection.originalApplication;
  return task.uploadedFile.id ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusDecisionLetter(appeal) {
  const task = appeal.requiredDocumentsSection.decisionLetter;
  return task.uploadedFile.id ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusApplicationNumber(appeal) {
  const task = appeal.requiredDocumentsSection;
  return task.applicationNumber ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusHealthAndSafety(appeal) {
  return appeal.appealSiteSection.healthAndSafety &&
    appeal.appealSiteSection.healthAndSafety.hasIssues !== null
    ? TASK_STATUS.COMPLETED
    : TASK_STATUS.NOT_STARTED;
}

function statusSiteAccess(appeal) {
  const task = appeal.appealSiteSection.siteAccess;
  return task.canInspectorSeeWholeSiteFromPublicRoad !== null
    ? TASK_STATUS.COMPLETED
    : TASK_STATUS.NOT_STARTED;
}

function statusCheckYourAnswer(appeal) {
  if (appeal.state === 'SUBMITTED') {
    return TASK_STATUS.COMPLETED;
  }

  const tasksRules = [
    statusYourDetails,
    statusApplicationNumber,
    statusOriginalApplication,
    statusDecisionLetter,
    statusAppealStatement,
    statusAppealSiteAddress,
    statusSiteOwnership,
    statusSiteAccess,
    statusHealthAndSafety,
  ];

  for (let i = 0; i < tasksRules.length; i += 1) {
    const rule = tasksRules[i];
    const taskStatus = rule(appeal);

    if (taskStatus !== TASK_STATUS.COMPLETED) {
      return TASK_STATUS.CANNOT_START_YET;
    }
  }

  return TASK_STATUS.NOT_STARTED;
}

const SECTIONS = {
  aboutYouSection: {
    yourDetails: {
      href: `/${VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU}`,
      rule: statusYourDetails,
    },
  },
  requiredDocumentsSection: {
    applicationNumber: {
      href: `/${VIEW.APPELLANT_SUBMISSION.APPLICATION_NUMBER}`,
      rule: statusApplicationNumber,
    },
    originalApplication: {
      href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION}`,
      rule: statusOriginalApplication,
    },
    decisionLetter: {
      href: `/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`,
      rule: statusDecisionLetter,
    },
  },
  yourAppealSection: {
    appealStatement: {
      href: `/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`,
      rule: statusAppealStatement,
    },
    otherDocuments: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
      rule: statusSupportingDocuments,
    },
  },
  appealSiteSection: {
    siteAddress: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
      rule: statusAppealSiteAddress,
    },
    siteOwnership: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
      rule: statusSiteOwnership,
    },
    siteAccess: { href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`, rule: statusSiteAccess },
    healthAndSafety: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
      rule: statusHealthAndSafety,
    },
  },
  submitYourAppealSection: {
    checkYourAnswers: {
      href: `/${VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS}`,
      rule: statusCheckYourAnswer,
    },
  },
};

function notStartedRule() {
  return TASK_STATUS.NOT_STARTED;
}

const FULL_APPEAL_SECTIONS = {
  contactDetailsSection: {
    href: `/${FULL_APPEAL.ORIGINAL_APPLICANT}`,
    rule: statusContactDetails,
  },
  appealSiteSection: {
    href: `/${FULL_APPEAL.APPEAL_SITE_ADDRESS}`,
    rule: statusAppealSiteSection,
  },
  appealDecisionSection: {
    href: `/${FULL_APPEAL.HOW_DECIDE_APPEAL}`,
    rule: statusAppealDecisionSection,
  },
  aboutAppealSiteSection: {
    href: `/${FULL_APPEAL.APPEAL_SITE_ADDRESS}`,
    rule: notStartedRule,
  },
  planningApplicationDocumentsSection: {
    href: `/${FULL_APPEAL.APPLICATION_FORM}`,
    rule: notStartedRule,
  },
  appealDocumentsSection: {
    href: `/${FULL_APPEAL.APPEAL_STATEMENT}`,
    rule: statusAppealStatement,
  },
  submitYourAppealSection: {
    href: `/${FULL_APPEAL.CHECK_YOUR_ANSWERS}`,
    rule: () => TASK_STATUS.NOT_STARTED,
  },
  aboutYouSection: {
    yourDetails: {
      href: `/${FULL_APPEAL.APPLICANT_NAME}`,
      rule: statusYourDetails,
    },
    contactDetails: {
      href: `/${FULL_APPEAL.CONTACT_DETAILS}`,
      rule: notStartedRule(),
    },
  },
  requiredDocumentsSection: {
    applicationNumber: {
      href: `/${FULL_APPEAL.APPLICATION_NUMBER}`,
      rule: statusApplicationNumber,
    },
    designAccessStatementSubmitted: {
      href: `/full-appeal/submit-appeal/design-access-statement-submitted`,
      rule: notStartedRule,
    },
  },
  yourAppealSection: {
    appealStatement: {
      href: `/${FULL_APPEAL.APPEAL_STATEMENT}`,
      rule: statusAppealStatement,
    },
  },
};

const getTaskStatus = (appeal, sectionName, taskName, sections = SECTIONS) => {
  try {
    const { rule } = taskName ? sections[sectionName][taskName] : sections[sectionName];
    return rule(appeal);
  } catch (e) {
    return null;
  }
};

// Get next section task
const getNextTask = (appeal, currentTask, sections = SECTIONS) => {
  const { sectionName, taskName } = currentTask;

  const section = sections[sectionName];

  const tasksNames = Object.keys(section);
  const tasks = Object.entries(section);

  const taskIndex = tasksNames.indexOf(taskName);

  for (let i = taskIndex + 1; i < tasks.length; i += 1) {
    const nextTaskName = tasks[i][0];

    let status = getTaskStatus(appeal, sectionName, nextTaskName);
    if (!status && status !== TASK_STATUS.CANNOT_START_YET) {
      // eslint-disable-next-line prefer-destructuring
      status = tasks[i][1];
    }

    const nextTask = {
      taskName: nextTaskName,
      status,
      href: sections[sectionName][nextTaskName].href,
    };
    if (TASK_STATUS.CANNOT_START_YET !== nextTask.status) {
      return nextTask;
    }
  }

  return { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` };
};

module.exports = {
  SECTIONS,
  FULL_APPEAL_SECTIONS,
  getTaskStatus,
  getNextTask,
};
