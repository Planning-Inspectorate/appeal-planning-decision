module.exports = {
  id: null,
  appealId: null,
  state: 'DRAFT',
  aboutAppealSection: {
    submissionAccuracy: null,
    extraConditions: {
      hasExtraConditions: null,
      extraConditions: '',
    },
    areaAppeals: {
      adjacentAppeals: null,
      appealReferenceNumbers: '',
    },
  },
  aboutAppealSiteSection: {
    aboutSite: {
      cannotSeeLand: null,
      wouldNeedToEnter: null,
      wouldNeedNeighbourAccess: null,
      wouldAffectListedBuilding: null,
      isGreenBelt: null,
      isConservationArea: null,
    },
  },
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
      areaAppeals: 'NOT STARTED',
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
