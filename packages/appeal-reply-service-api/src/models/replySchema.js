const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const uploadedFilesSchema = new Schema({
  name: String,
  id: String,
});

const uploadedFilesMetaSchema = new Schema({
  name: String,
  id: String,
  status: String,
  isSubjectPublicConsultation: String,
  formalAdoption: String,
  emergingDocument: String,
});

const replySchema = new Mongoose.Schema({
  id: String,
  appealId: String,
  state: String,
  aboutAppealSection: {
    submissionAccuracy: Boolean,
    extraConditions: {
      hasExtraConditions: Boolean,
      extraConditions: String,
    },
    otherAppeals: {
      adjacentAppeals: Boolean,
      appealReferenceNumbers: String,
    },
  },
  aboutAppealSiteSection: {
    cannotSeeLand: Boolean,
    wouldNeedToEnter: Boolean,
    wouldNeedNeighbourAccess: Boolean,
    wouldAffectListedBuilding: Boolean,
    isGreenBelt: Boolean,
    isConservationArea: Boolean,
  },
  requiredDocumentsSection: {
    plansDecision: {
      uploadedFiles: [uploadedFilesSchema],
    },
    officersReport: {
      uploadedFiles: [uploadedFilesSchema],
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      uploadedFiles: [uploadedFilesSchema],
    },
    representationsInterestedParties: {
      uploadedFiles: [uploadedFilesSchema],
    },
    interestedPartiesAppeal: {
      uploadedFiles: [uploadedFilesSchema],
    },
    siteNotices: Boolean,
    planningHistory: {
      uploadedFiles: [uploadedFilesSchema],
    },
    statutoryDevelopment: {
      uploadedFiles: [uploadedFilesSchema],
    },
    otherPolicies: {
      uploadedFiles: [uploadedFilesMetaSchema],
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: [uploadedFilesSchema],
    },
    developmentOrNeighbourhood: {
      hasPlanSubmitted: Boolean,
      planChanges: String,
    },
  },
  sectionStates: {
    aboutAppealSection: {
      submissionAccuracy: String,
      extraConditions: String,
      otherAppeals: String,
    },
    aboutAppealSiteSection: {
      aboutSite: String,
    },
    requiredDocumentsSection: {
      plansDecision: String,
      officersReport: String,
    },
    optionalDocumentsSection: {
      interestedPartiesApplication: String,
      representationsInterestedParties: String,
      interestedPartiesAppeal: String,
      siteNotices: String,
      planningHistory: String,
      statutoryDevelopment: String,
      otherPolicies: String,
      supplementaryPlanningDocuments: String,
      developmentOrNeighbourhood: String,
    },
    submitReplySection: {
      checkYourAnswers: String,
    },
  },
});

module.exports = { replySchema };
