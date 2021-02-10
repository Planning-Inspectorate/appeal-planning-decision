const Mongoose = require('mongoose');
const replySchema = require('./replySchema');

const Model = Mongoose.model('Model', replySchema);
const blankModel = new Model({
  id: '',
  appealId: '',
  state: '',
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
      areaAppeals: '',
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
});

module.exports = { blankModel };
