const Mongoose = require('mongoose');

const uploadedFilesSchema = new Mongoose.Schema({
  name: { type: String, default: '' },
  id: { type: String, default: '' },
});

const uploadedFilesMetaSchema = new Mongoose.Schema({
  name: { type: String, default: '' },
  id: { type: String, default: '' },
  documentName: { type: String, default: '' },
  adoptedDate: { type: Date, default: null },
  stageReached: { type: String, default: '' },
});

const replySchema = new Mongoose.Schema({
  _id: false,
  id: { type: String, default: '' },
  appealId: { type: String, default: '' },
  state: { type: String, default: '' },
  submissionDate: { type: Date, default: null },
  aboutAppealSection: {
    submissionAccuracy: {
      accurateSubmission: { type: Boolean, default: null },
      inaccuracyReason: { type: String, default: '' },
    },
    extraConditions: {
      hasExtraConditions: { type: Boolean, default: null },
      extraConditions: { type: String, default: '' },
    },
    otherAppeals: {
      adjacentAppeals: { type: Boolean, default: null },
      appealReferenceNumbers: { type: String, default: '' },
    },
  },
  siteSeenPublicLand: { type: Boolean, default: null },
  enterAppealSite: {
    mustEnter: { type: Boolean, default: null },
    enterReasons: { type: String, default: '' },
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
    siteNotices: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    conservationAreaMap: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    planningHistory: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    statutoryDevelopment: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    otherPolicies: {
      uploadedFiles: { type: [uploadedFilesSchema], default: [] },
    },
    supplementaryPlanningDocuments: {
      uploadedFiles: { type: [uploadedFilesMetaSchema], default: [] },
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
      conservationAreaMap: { type: String, default: 'NOT STARTED' },
      planningHistory: { type: String, default: 'NOT STARTED' },
      statutoryDevelopment: { type: String, default: 'NOT STARTED' },
      otherPolicies: { type: String, default: 'NOT STARTED' },
      supplementaryPlanningDocuments: { type: String, default: 'NOT STARTED' },
      developmentOrNeighbourhood: { type: String, default: 'NOT STARTED' },
    },
  },
  submission: {
    pdfStatement: {
      uploadedFile: { type: uploadedFilesSchema, default: null },
    },
  },
});

module.exports = Mongoose.model('Reply', replySchema);
