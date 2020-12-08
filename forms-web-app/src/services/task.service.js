const { VIEW } = require('../lib/views');

const TASK_STATUS = {
  CANNOT_START_YET: 'CANNOT START YET',
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  TODO: 'TODO',
};

function statusWhoAreYou(appeal) {
  let status = TASK_STATUS.NOT_STARTED;

  const task = appeal.aboutYouSection.yourDetails;

  const isStarted = task.isOriginalApplicant;

  if (isStarted !== null) {
    status = TASK_STATUS.IN_PROGRESS;
  } else {
    return status;
  }

  let isComplete = task.isOriginalApplicant && task.name;

  isComplete = isComplete || (!task.isOriginalApplicant && task.appealingOnBehalfOf);

  if (isComplete) {
    status = TASK_STATUS.COMPLETED;
  }
  return status;
}

function statusAppealStatement(appeal) {
  const task = appeal.yourAppealSection.appealStatement;
  return task.uploadedFile.name ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
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
  const task = appeal.appealSiteSection.siteAddress;
  return task.addressLine1 ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
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
    statusWhoAreYou,
    statusApplicationNumber,
    statusOriginalApplication,
    statusDecisionLetter,
    statusAppealStatement,
    statusAppealSiteAddress,
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
      rule: statusWhoAreYou,
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
    },
    otherAppeals: { href: 'other-appeals' },
  },
  appealSiteSection: {
    siteAddress: {
      href: `/${VIEW.APPELLANT_SUBMISSION.SITE_LOCATION}`,
      rule: statusAppealSiteAddress,
    },
    siteAccess: { href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS}`, rule: statusSiteAccess },
    siteOwnership: { href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}` },
    healthAndSafety: { href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}` },
  },
  submitYourAppealSection: {
    checkYourAnswers: { href: `/${VIEW.CHECK_ANSWERS}`, rule: statusCheckYourAnswer },
  },
};

// Get next section task
const getNextUncompletedTask = (sectionStates, currentTask, sections = SECTIONS) => {
  const { sectionName, taskName } = currentTask;

  const section = sectionStates[sectionName];

  const tasksNames = Object.keys(section);
  const tasks = Object.entries(section);

  const taskIndex = tasksNames.indexOf(taskName);

  for (let i = taskIndex + 1; i < tasks.length; i += 1) {
    const nextTaskName = tasks[i][0];

    const nextTask = {
      taskName: nextTaskName,
      status: tasks[i][1],
      href: sections[sectionName][nextTaskName].href,
      // TODO fix when aligned
    };
    if (nextTask.status !== TASK_STATUS.COMPLETED) {
      return nextTask;
    }
  }

  return { href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}` };
};

const getTaskStatus = (appeal, sectionName, taskName) => {
  try {
    const { rule } = SECTIONS[sectionName][taskName];
    return rule(appeal);
  } catch (e) {
    return TASK_STATUS.TODO;
  }
};

module.exports = {
  SECTIONS,
  getTaskStatus,
  getNextUncompletedTask,
};
