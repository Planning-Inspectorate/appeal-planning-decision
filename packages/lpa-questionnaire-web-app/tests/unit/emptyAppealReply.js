module.exports = {
  id: null,
  appealId: null,
  state: 'DRAFT',
  aboutAppealSection: {
    submissionAccuracy: {
      accurateSubmission: null,
      inaccuracyReason: '',
    },
    extraConditions: {
      hasExtraConditions: null,
      extraConditions: '',
    },
    otherAppeals: {
      adjacentAppeals: null,
      appealReferenceNumbers: '',
    },
  },
  siteSeenPublicLand: null,
  enterAppealSite: {
    mustEnter: null,
    enterReasons: '',
  },
  greenBelt: null,
  requiredDocumentsSection: {
    plansDecision: {
      uploadedFiles: [],
    },
    officersReport: {
      uploadedFiles: [],
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      uploadedFiles: [],
    },
    representationsInterestedParties: {
      uploadedFiles: [],
    },
    interestedPartiesAppeal: {
      uploadedFiles: [],
    },
    siteNotices: null,
    planningHistory: {
      uploadedFiles: [],
    },
    statutoryDevelopment: {
      uploadedFiles: [],
    },
    otherPolicies: {
      uploadedFiles: [],
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: [],
    },
    developmentOrNeighbourhood: {
      hasPlanSubmitted: null,
      planChanges: '',
    },
  },
  sectionStates: {
    aboutAppealSection: {
      submissionAccuracy: 'NOT STARTED',
      extraConditions: 'NOT STARTED',
      otherAppeals: 'NOT STARTED',
    },
    aboutAppealSiteSection: {
      aboutSite: 'NOT STARTED',
    },
    requiredDocumentsSection: {
      plansDecision: 'NOT STARTED',
      officersReport: 'NOT STARTED',
    },
    optionalDocumentsSection: {
      interestedPartiesApplication: 'NOT STARTED',
      representationsInterestedParties: 'NOT STARTED',
      interestedPartiesAppeal: 'NOT STARTED',
      siteNotices: 'NOT STARTED',
      planningHistory: 'NOT STARTED',
      statutoryDevelopment: 'NOT STARTED',
      otherPolicies: 'NOT STARTED',
      supplementaryPlanningDocuments: 'NOT STARTED',
      developmentOrNeighbourhood: 'NOT STARTED',
    },
  },
};
