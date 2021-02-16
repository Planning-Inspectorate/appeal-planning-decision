const blankModel = {
  id: '',
  appealId: '',
  state: '',
  aboutAppealSection: {
    submissionAccuracy: null,
    extraConditions: {
      hasExtraConditions: null,
      extraConditions: '',
    },
    otherAppeals: {
      adjacentAppeals: null,
      appealReferenceNumbers: '',
    },
  },
  aboutAppealSiteSection: {
    cannotSeeLand: null,
    wouldNeedToEnter: null,
    wouldNeedNeighbourAccess: null,
    wouldAffectListedBuilding: null,
    isGreenBelt: null,
    isConservationArea: null,
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
      uploadedFiles: [
        {
          name: '',
          id: '',
          status: '',
          isSubjectPublicConsultation: '',
          formalAdoption: '',
          emergingDocument: '',
        },
      ],
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
      submissionAccuracy: '',
      extraConditions: '',
      otherAppeals: '',
    },
    aboutAppealSiteSection: {
      aboutSite: '',
    },
    requiredDocumentsSection: {
      plansDecision: '',
      officersReport: '',
    },
    optionalDocumentsSection: {
      interestedPartiesApplication: '',
      representationsInterestedParties: '',
      interestedPartiesAppeal: '',
      siteNotices: '',
      planningHistory: '',
      statutoryDevelopment: '',
      otherPolicies: '',
      supplementaryPlanningDocuments: '',
      developmentOrNeighbourhood: '',
    },
    submitReplySection: {
      checkYourAnswers: '',
    },
  },
};

module.exports = { blankModel };
