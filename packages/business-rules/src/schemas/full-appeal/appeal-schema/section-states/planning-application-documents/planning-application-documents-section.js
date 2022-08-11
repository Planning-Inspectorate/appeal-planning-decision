const pinsYup = require('../../../../../lib/pins-yup');
const {
	sectionStateValidation
} = require('../../../../components/insert/section-state-validation');

const planningApplicationDocumentsSectionStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			ownershipCertificate: sectionStateValidation(),
			descriptionDevelopmentCorrect: sectionStateValidation(),
			plansDrawingsSupportingDocuments: sectionStateValidation(),
			originalApplication: sectionStateValidation(),
			decisionLetter: sectionStateValidation(),
			designAccessStatement: sectionStateValidation(),
			designAccessStatementSubmitted: sectionStateValidation(),
			originalDecisionNotice: sectionStateValidation(),
			letterConfirmingApplication: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = { planningApplicationDocumentsSectionStateValidation };
