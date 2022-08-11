const pinsYup = require('../../../../lib/pins-yup');
const {
	appealDecisionSectionStateValidation
} = require('./appeal-decision-section/appeal-decision-section');
const {
	appealDocumentsSectionStateValidation
} = require('./appeal-documents-section/appeal-documents-section');
const { appealSiteSectionStateValidation } = require('./appeal-site-section/appeal-site-section');
const {
	contactDetailsSectionStateValidation
} = require('./contact-details-section/contact-details-section');
const {
	planningApplicationDocumentsSectionStateValidation
} = require('./planning-application-documents/planning-application-documents-section');

const sectionStatesValidation = () => {
	return pinsYup
		.object()
		.shape({
			contactDetailsSection: contactDetailsSectionStateValidation(),
			appealSiteSection: appealSiteSectionStateValidation(),
			appealDecisionSection: appealDecisionSectionStateValidation(),
			planningApplicationDocumentsSection: planningApplicationDocumentsSectionStateValidation(),
			appealDocumentsSection: appealDocumentsSectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = { sectionStatesValidation };
