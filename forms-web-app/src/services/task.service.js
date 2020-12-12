const { VIEW } = require('../lib/views');

const TASK_STATUS = {
  CANNOT_START_YET: 'CANNOT START YET',
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  TODO: 'TODO',
};

function statusYourDetails(appeal) {
  const {
    isOriginalApplicant,
    name,
    email,
    appealingOnBehalfOf,
  } = appeal.aboutYouSection.yourDetails;

  const isStarted = isOriginalApplicant !== null || name || email || appealingOnBehalfOf;

  if (!isStarted) {
    return TASK_STATUS.NOT_STARTED;
  }

  return (isOriginalApplicant || appealingOnBehalfOf) && name
    ? TASK_STATUS.COMPLETED
    : TASK_STATUS.IN_PROGRESS;
}

function statusAppealStatement(appeal) {
  const task = appeal.yourAppealSection.appealStatement;
  return task.hasSensitiveInformation === false ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

// eslint-disable-next-line no-unused-vars
function statusOtherDocuments(appeal) {
  return TASK_STATUS.TODO;
}

// eslint-disable-next-line no-unused-vars
function statusOtherAppeals(appeal) {
  return TASK_STATUS.TODO;
}

function statusOriginalApplication(appeal) {
  const task = appeal.requiredDocumentsSection.originalApplication;
  return task.uploadedFile.name ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusDecisionLetter(appeal) {
  const task = appeal.requiredDocumentsSection.decisionLetter;
  return task.uploadedFile.name ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusApplicationNumber(appeal) {
  const task = appeal.requiredDocumentsSection;
  return task.applicationNumber ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

function statusAppealSiteAddress(appeal) {
  const { addressLine1, county, postcode } = appeal.appealSiteSection.siteAddress;
  return addressLine1 && county && postcode ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
}

// eslint-disable-next-line no-unused-vars
function healthAndSafety(appeal) {
  return TASK_STATUS.TODO;
}

// eslint-disable-next-line no-unused-vars
function statusSiteOwnership(appeal) {
  return TASK_STATUS.TODO;
}

function statusSiteAccess(appeal) {
  const task = appeal.appealSiteSection.siteAccess;
  return task.canInspectorSeeWholeSiteFromPublicRoad
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
    statusSiteAccess,
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
      rule: statusOtherDocuments,
    },
    otherAppeals: { href: 'other-appeals', rule: statusOtherAppeals },
  },
  appealSiteSection: {
    siteAddress: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
      rule: statusAppealSiteAddress,
    },
    siteAccess: { href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`, rule: statusSiteAccess },
    siteOwnership: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
      rule: statusSiteOwnership,
    },
    healthAndSafety: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
      rule: healthAndSafety,
    },
  },
  submitYourAppealSection: {
    checkYourAnswers: { href: `/${VIEW.CHECK_ANSWERS}`, rule: statusCheckYourAnswer },
  },
};

const getTaskStatus = (appeal, sectionName, taskName, sections = SECTIONS) => {
  try {
    const { rule } = sections[sectionName][taskName];
    return rule(appeal);
  } catch (e) {
    return null;
  }
};

// Get next section task
const getNextUncompletedTask = (appeal, currentTask, sections = SECTIONS) => {
  const { sectionName, taskName } = currentTask;

  const section = appeal.sectionStates[sectionName];

  const tasksNames = Object.keys(section);
  const tasks = Object.entries(section);

  const taskIndex = tasksNames.indexOf(taskName);

  for (let i = taskIndex + 1; i < tasks.length; i += 1) {
    const nextTaskName = tasks[i][0];

    // TODO fix when aligned and no TODO task displayed
    let status = getTaskStatus(appeal, sectionName, nextTaskName);
    if (!status && status !== TASK_STATUS.TODO) {
      // eslint-disable-next-line prefer-destructuring
      status = tasks[i][1];
    }

    const nextTask = {
      taskName: nextTaskName,
      status,
      href: sections[sectionName][nextTaskName].href,
    };
    if (![TASK_STATUS.COMPLETED, TASK_STATUS.TODO].includes(nextTask.status)) {
      return nextTask;
    }
  }

  return { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` };
};

module.exports = {
  SECTIONS,
  getTaskStatus,
  getNextUncompletedTask,
};
