const pinsYup = require('../../../../lib/pins-yup');
const appealDecisionStateValidation = require('./appeal-decision-state/appeal-decision-state-validation');
const appealDocumentsStateValidation = require('./appeal-documents-state/appeal-documents-state-validation');
const appealSiteStateValidation = require('./appeal-site-state/appeal-site-state-validation');
const contactDetailsStateValidation = require('./contact-details-state/contact-details-state-validation');
const planningApplicationDocumentsStateValidation = require('./planning-application-documents-state/planning-application-documents-state-validation');

const sectionStatesValidation = () => {
	return pinsYup
		.object()
		.shape({
			contactDetailsSection: contactDetailsStateValidation(),
			appealSiteSection: appealSiteStateValidation(),
			appealDecisionSection: appealDecisionStateValidation(),
			planningApplicationDocumentsSection: planningApplicationDocumentsStateValidation(),
			appealDocumentsSection: appealDocumentsStateValidation()
		})
		.noUnknown(true);
};

module.exports = sectionStatesValidation;
