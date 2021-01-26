const { VIEW } = require('../lib/views');
const TASK_STATUS = require('./task-status/task-statuses');

function statusTemp() {
  // TODO: these will be replaces when we have checks for status of each step
  return TASK_STATUS.NOT_STARTED;
}

function statusCheckYourAnswer() {
  // TODO: needs to check questionnaire status to allow check
  return TASK_STATUS.CANNOT_START_YET;
}

const SECTIONS = {
  aboutAppealSection: {
    submissionAccuracy: {
      href: '#',
      rule: statusTemp,
    },
    extraConditions: {
      href: '#',
      rule: statusTemp,
    },
    areaAppeals: {
      href: '#',
      rule: statusTemp,
    },
  },
  aboutAppealSiteSection: {
    aboutSite: {
      href: '#',
      rule: statusTemp,
    },
  },
  requiredDocumentsSection: {
    plansDecision: {
      href: '#',
      rule: statusTemp,
    },
    officersReport: {
      href: '#',
      rule: statusTemp,
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      href: '#',
      rule: statusTemp,
    },
    representationsInterestedParties: {
      href: '#',
      rule: statusTemp,
    },
    interestedPartiesAppeal: {
      href: '#',
      rule: statusTemp,
    },
    siteNotices: {
      href: '#',
      rule: statusTemp,
    },
    planningHistory: {
      href: '#',
      rule: statusTemp,
    },
    statutoryDevelopment: {
      href: '#',
      rule: statusTemp,
    },
    otherPolicies: {
      href: '#',
      rule: statusTemp,
    },
    supplementaryPlanningDocuments: {
      href: '#',
      rule: statusTemp,
    },
    developmentOrNeighbourhood: {
      href: '#',
      rule: statusTemp,
    },
    submitQuestionnaireSection: {
      checkYourAnswers: {
        href: '#',
        rule: statusCheckYourAnswer,
      },
    },
  },
};

const getTaskStatus = (questionnaire, sectionName, taskName, sections = SECTIONS) => {
  try {
    const { rule } = sections[sectionName][taskName];
    return rule(questionnaire);
  } catch (e) {
    return null;
  }
};

// Get next section task
const getNextTask = () => {
  return { href: `/${VIEW.TASK_LIST}` };
};

module.exports = {
  SECTIONS,
  getTaskStatus,
  getNextTask,
};
