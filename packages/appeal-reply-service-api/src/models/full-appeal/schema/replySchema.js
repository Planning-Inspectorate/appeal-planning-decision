const { Schema } = require('mongoose');

const options = { discriminatorKey: 'decisionOutcome' };
const procedureTypeReviewSchema = new Schema({
  _id: false,
});
const issuesConstraintsDesignationsSchema = new Schema({
  _id: false,
});
const environmentalImpactAssessmentSchema = new Schema({
  _id: false,
});
const peoplNotificationSchema = new Schema({
  _id: false,
});
const consultationResponseSchema = new Schema({
  _id: false,
});
const siteAccessSchema = new Schema({
  _id: false,
});
const additionalInformationSchema = new Schema({
  _id: false,
});
const baseReplySchema = new Schema(
  {
    _id: false,
    id: { type: String, default: '' },
    appealId: { type: String, default: '' },
    procedureTypeReview: { type: procedureTypeReviewSchema, default: {} },
    issuesConstraintsDesignation: { type: issuesConstraintsDesignationsSchema, default: {} },
    environmentalImpactAssessment: { type: environmentalImpactAssessmentSchema, default: {} },
    peoplNotification: { type: peoplNotificationSchema, default: {} },
    consultationResponse: { type: consultationResponseSchema, default: {} },
    siteAccess: { type: siteAccessSchema, default: {} },
    additionalInformation: { type: additionalInformationSchema, default: {} },
  },
  options
);

const planningOfficerReportSchema = new Schema({
  _id: false,
});
const deterministicReplySchema = new Schema({
  _id: false,
  planningOfficerReport: { type: planningOfficerReportSchema, default: {} },
});

const decisionNoticeSchema = new Schema({
  _id: false,
});
const nonDeterministicReplySchema = new Schema({
  _id: false,
  decisionNotice: { type: decisionNoticeSchema, default: {} },
});

module.exports = { baseReplySchema, deterministicReplySchema, nonDeterministicReplySchema };
