const TASK_STATUS = require('./task-status/task-statuses');

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
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'extraConditions',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'areaAppeals',
        href: '#',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'aboutAppealSiteSection',
    tasks: [
      {
        taskId: 'aboutSite',
        href: '#',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'requiredDocumentsSection',
    tasks: [
      {
        taskId: 'plansDecision',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'officersReport',
        href: '#',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'optionalDocumentsSection',
    tasks: [
      {
        taskId: 'interestedPartiesApplication',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'representationsInterestedParties',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'interestedPartiesAppeal',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'siteNotices',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'planningHistory',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'statutoryDevelopment',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'otherPolicies',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'supplementaryPlanningDocuments',
        href: '#',
        rule: statusTemp,
      },
      {
        taskId: 'developmentOrNeighbourhood',
        href: '#',
        rule: statusTemp,
      },
    ],
  },
  {
    sectionId: 'submitQuestionnaireSection',
    tasks: [
      {
        taskId: 'checkYourAnswers',
        href: '#',
        rule: statusCheckYourAnswer,
      },
    ],
  },
];

const HEADERS = {
  aboutAppealSection: 'About the appeal',
  submissionAccuracy: "Review accuracy of the appellant's submission",
  extraConditions: 'Do you have any extra conditions?',
  areaAppeals: 'Tell us about any appeals in the immediate area',
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

module.exports = {
  HEADERS,
  SECTIONS,
};
