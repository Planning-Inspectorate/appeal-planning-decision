const pinsYup = require('../../../lib/pins-yup');
const appealDetails = require('../../components/appeal-details-validation/appeal-details-validation');
const eligibilityValidation = require('./eligibility/eligibility-validation');
const contactDetailsValidation = require('./sections/contact-details/contact-details-validation');
const appealSiteValidation = require('./sections/appeal-site/appeal-site-validation');
const appealDecisionValidation = require('./sections/appeal-decision/appeal-decision-validation');
const planningApplicationDocumentsValidation = require('./sections/planning-application-documents/planning-application-documents-validation');
const appealDocumentsValidation = require('./sections/appeal-documents/appeal-documents-validation');
const appealSubmissionValidation = require('./sections/appeal-submission/appeal-submission-validation');
const sectionStatesValidation = require('./section-states/section-states-validation');

const appealValidationSchema = () => {
	return pinsYup
		.object()
		.noUnknown(true)
		.shape({
			...appealDetails(),
			eligibility: eligibilityValidation(),
			contactDetailsSection: contactDetailsValidation(),
			appealSiteSection: appealSiteValidation(),
			appealDecisionSection: appealDecisionValidation(),
			planningApplicationDocumentsSection: planningApplicationDocumentsValidation(),
			appealDocumentsSection: appealDocumentsValidation(),
			appealSubmission: appealSubmissionValidation(),
			sectionStates: sectionStatesValidation()
		});
};

module.exports = appealValidationSchema;
