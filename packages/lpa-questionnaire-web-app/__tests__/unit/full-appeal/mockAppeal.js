const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');

module.exports = {
  aboutYouSection: { yourDetails: { name: 'Someone' } },
  appealType: APPEAL_ID.PLANNING_SECTION_78,
  decisionDate: null,
  eligibility: { applicationDecision: APPLICATION_DECISION.GRANTED, enforcementNotice: null },
  requiredDocumentsSection: { applicationNumber: '12345' },
  appealSiteSection: {
    siteAddress: { address1: '11 Kingston Road', city: 'Bristol', postCode: 'BR12 7AU' },
  },
};
