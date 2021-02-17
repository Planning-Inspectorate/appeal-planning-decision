const Mongoose = require('mongoose');

const uploadedFilesSchema = new Mongoose.Schema({
  name: { type: String, default: '' },
  id: { type: String, default: '' },
});

const uploadedFilesMetaSchema = new Mongoose.Schema({
  name: { type: String, default: '' },
  id: { type: String, default: '' },
  status: { type: String, default: '' },
  isSubjectPublicConsultation: { type: String, default: '' },
  formalAdoption: { type: String, default: '' },
  emergingDocument: { type: String, default: '' },
});

const replySchema = new Mongoose.Schema({
  _id: false,
  id: { type: String, default: '' },
  appealId: { type: String, default: '' },
  state: { type: String, default: '' },
  aboutAppealSection: {
    submissionAccuracy: { type: Boolean, default: null },
    extraConditions: {
      hasExtraConditions: { type: Boolean, default: null },
      extraConditions: { type: String, default: '' },
    },
    otherAppeals: {
      adjacentAppeals: { type: Boolean, default: null },
      appealReferenceNumbers: { type: String, default: '' },
    },
  },
  aboutAppealSiteSection: {
    cannotSeeLand: { type: Boolean, default: null },
    wouldNeedToEnter: { type: Boolean, default: null },
    wouldNeedNeighbourAccess: { type: Boolean, default: null },
    wouldAffectListedBuilding: { type: Boolean, default: null },
    isGreenBelt: { type: Boolean, default: null },
    isConservationArea: { type: Boolean, default: null },
  },
  requiredDocumentsSection: {
    plansDecision: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    officersReport: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
  },
  optionalDocumentsSection: {
    interestedPartiesApplication: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    representationsInterestedParties: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    interestedPartiesAppeal: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    siteNotices: { type: Boolean, default: null },
    planningHistory: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    statutoryDevelopment: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    otherPolicies: {
      uploadedFiles: { type: [uploadedFilesMetaSchema], default: [] },
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    developmentOrNeighbourhood: {
      hasPlanSubmitted: { type: Boolean, default: null },
      planChanges: { type: String, default: '' },
    },
  },
  sectionStates: {
    aboutAppealSection: {
      submissionAccuracy: { type: String, default: 'NOT STARTED' },
      extraConditions: { type: String, default: 'NOT STARTED' },
      otherAppeals: { type: String, default: 'NOT STARTED' },
    },
    aboutAppealSiteSection: {
      aboutSite: { type: String, default: 'NOT STARTED' },
    },
    requiredDocumentsSection: {
      plansDecision: { type: String, default: 'NOT STARTED' },
      officersReport: { type: String, default: 'NOT STARTED' },
    },
    optionalDocumentsSection: {
      interestedPartiesApplication: { type: String, default: 'NOT STARTED' },
      representationsInterestedParties: { type: String, default: 'NOT STARTED' },
      interestedPartiesAppeal: { type: String, default: 'NOT STARTED' },
      siteNotices: { type: String, default: 'NOT STARTED' },
      planningHistory: { type: String, default: 'NOT STARTED' },
      statutoryDevelopment: { type: String, default: 'NOT STARTED' },
      otherPolicies: { type: String, default: 'NOT STARTED' },
      supplementaryPlanningDocuments: { type: String, default: 'NOT STARTED' },
      developmentOrNeighbourhood: { type: String, default: 'NOT STARTED' },
    },
  },
});

module.exports = Mongoose.model('Reply', replySchema);
