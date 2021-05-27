const {
  accuracySubmissionCompletion,
  otherAppealsCompletion,
  extraConditionsCompletion,
  developmentPlanCompletion,
  uploadPlansCompletion,
  officersReportCompletion,
  interestedPartiesCompletion,
  representationsCompletion,
  notifyingPartiesCompletion,
  siteNoticesCompletion,
  conservationAreaMapCompletion,
  planningHistoryCompletion,
  otherPoliciesCompletion,
  statutoryDevelopmentCompletion,
  booleanCompletion,
} = require('./task-status');
const checkYourAnswerCompletion = require('./task-status/check-your-answers');

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
    sectionId: 'aboutSiteSection',
    tasks: [
      {
        taskId: 'siteSeenPublicLand',
        href: '/public-land',
        rule: booleanCompletion,
      },
    ],
  },
  {
    sectionId: 'requiredDocumentsSection',
    tasks: [
      {
        taskId: 'plansDecision',
        href: '/plans',
        rule: uploadPlansCompletion,
      },
      {
        taskId: 'officersReport',
        href: '/officers-report',
        rule: officersReportCompletion,
      },
    ],
  },
  {
    sectionId: 'optionalDocumentsSection',
    tasks: [
      {
        taskId: 'interestedPartiesApplication',
        href: '/interested-parties',
        rule: interestedPartiesCompletion,
      },
      {
        taskId: 'representationsInterestedParties',
        href: '/representations',
        rule: representationsCompletion,
      },
      {
        taskId: 'interestedPartiesAppeal',
        href: '/notifications',
        rule: notifyingPartiesCompletion,
      },
      {
        taskId: 'siteNotices',
        href: '/site-notice',
        rule: siteNoticesCompletion,
      },
      {
        taskId: 'conservationAreaMap',
        href: '/conservation-area-map',
        rule: conservationAreaMapCompletion,
      },
      {
        taskId: 'planningHistory',
        href: '/planning-history',
        rule: planningHistoryCompletion,
      },
      {
        taskId: 'otherPolicies',
        href: '/other-policies',
        rule: otherPoliciesCompletion,
      },
      {
        taskId: 'statutoryDevelopment',
        href: '/statutory-development',
        rule: statutoryDevelopmentCompletion,
      },
      {
        taskId: 'developmentOrNeighbourhood',
        href: '/development-plan',
        rule: developmentPlanCompletion,
      },
    ],
  },
  {
    sectionId: 'submitQuestionnaireSection',
    tasks: [
      {
        taskId: 'checkYourAnswers',
        href: '/confirm-answers',
        rule: checkYourAnswerCompletion,
      },
    ],
  },
];

const HEADERS = {
  aboutAppealSection: 'About the appeal',
  submissionAccuracy: "Review accuracy of the appellant's submission",
  extraConditions: 'Do you have any extra conditions?',
  otherAppeals: 'Tell us about any appeals in the immediate area',
  aboutSiteSection: 'About the Appeal Site',
  siteSeenPublicLand:
    'Can the inspector see the relevant parts of the appeal site from public land?',
  requiredDocumentsSection: 'Required documents',
  plansDecision: 'Plans used to reach the decision',
  officersReport: "Planning Officer's report",
  optionalDocumentsSection: 'Optional supporting documents',
  interestedPartiesApplication: 'Telling interested parties about the application',
  representationsInterestedParties: 'Representations from interested parties',
  interestedPartiesAppeal: 'Notifying interested parties of the appeal',
  siteNotices: 'Site notices',
  conservationAreaMap: 'Conservation area map and guidance',
  planningHistory: 'Planning history',
  otherPolicies: 'Other relevant policies',
  statutoryDevelopment: 'Statutory development plan policy',
  developmentOrNeighbourhood: 'Development Plan Document or Neighbourhood Plan',
  submitQuestionnaireSection: 'Before you submit',
  checkYourAnswers: 'Check your answers',
};

// Contains section descriptions that will appear underneath heading in sections on task list page
const DESCRIPTIONS = {
  optionalDocumentsSection:
    'Only include documents that were considered when making a decision on the application.',
};

// Contains overrides for check answers page headings. Should be used sparingly to avoid content mis-matches
const CHECK_ANSWERS = {
  submissionAccuracy:
    'Does the information from the appellant accurately reflect the original planning application?',
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
  CHECK_ANSWERS,
  getTaskStatus,
};
