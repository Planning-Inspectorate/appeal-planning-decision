const TASK_STATUS = require('./task-status/task-statuses');
const accuracySubmissionCompletion = require('./task-status/accuracy-submission');
const otherAppealsCompletion = require('./task-status/other-appeals');
const extraConditionsCompletion = require('./task-status/extra-conditions');

function statusTemp() {
  // TODO: these will be replaces when we have checks for status of each step
  return TASK_STATUS.NOT_STARTED;
}

function statusCheckYourAnswer() {
  // TODO: needs to check questionnaire status to allow check
  return TASK_STATUS.CANNOT_START_YET;
}

const SECTIONS = [
  {
    sectionId: 'aboutAppealSection',
    tasks: [
      {
        taskId: 'submissionAccuracy',
        href: '/accuracy-submission',
        rule: accuracySubmissionCompletion,
      },
      {
        taskId: 'extraConditions',
        href: '/extra-conditions',
        rule: extraConditionsCompletion,
      },
      {
        taskId: 'otherAppeals',
        href: '/other-appeals',
        rule: otherAppealsCompletion,
      },
    ],
  },
  {
    sectionId: 'aboutAppealSiteSection',
    tasks: [
      {
        taskId: 'aboutSite',
        href: '/placeholder',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'requiredDocumentsSection',
    tasks: [
      {
        taskId: 'plansDecision',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'officersReport',
        href: '/placeholder',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'optionalDocumentsSection',
    tasks: [
      {
        taskId: 'interestedPartiesApplication',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'representationsInterestedParties',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'interestedPartiesAppeal',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'siteNotices',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'planningHistory',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'statutoryDevelopment',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'otherPolicies',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'supplementaryPlanningDocuments',
        href: '/placeholder',
        rule: statusTemp,
      },
      {
        taskId: 'developmentOrNeighbourhood',
        href: '/placeholder',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'submitQuestionnaireSection',
    tasks: [
      {
        taskId: 'checkYourAnswers',
        href: '/placeholder',
        rule: statusCheckYourAnswer,
      },
    ],
  },
];

const HEADERS = {
  aboutAppealSection: 'About the appeal',
  submissionAccuracy: "Review accuracy of the appellant's submission",
  extraConditions: 'Do you have any extra conditions?',
  otherAppeals: 'Tell us about any appeals in the immediate area',
  aboutAppealSiteSection: 'About the appeal site',
  aboutSite: 'Tell us about the appeal site',
  requiredDocumentsSection: 'Required documents',
  plansDecision: 'Upload the plans used to reach the decision',
  officersReport: "Upload the Planning Officer's report",
  optionalDocumentsSection: 'Optional supporting documents',
  interestedPartiesApplication: 'Telling interested parties about the application',
  representationsInterestedParties: 'Representations from interested parties',
  interestedPartiesAppeal: 'Notifying interested parties of the appeal',
  siteNotices: 'Site notices',
  planningHistory: 'Planning history',
  statutoryDevelopment: 'Statutory development plan policy',
  otherPolicies: 'Other relevant policies',
  supplementaryPlanningDocuments: 'Supplementary planning document extracts',
  developmentOrNeighbourhood: 'Development Plan Document or Neighbourhood Plan',
  submitQuestionnaireSection: 'Before you submit',
  checkYourAnswers: 'Check your answers',
};

const DESCRIPTIONS = {
  optionalDocumentsSection:
    'Only include documents that were considered when making a decision on the application.',
};

const getTaskStatus = (appealReply, sectionId, taskId) => {
  try {
    const section = SECTIONS.find((scn) => scn.sectionId === sectionId);
    const task = section.tasks.find((tsk) => tsk.taskId === taskId);
    return task.rule(appealReply);
  } catch (e) {
    return null;
  }
};

module.exports = {
  HEADERS,
  DESCRIPTIONS,
  SECTIONS,
  getTaskStatus,
};
