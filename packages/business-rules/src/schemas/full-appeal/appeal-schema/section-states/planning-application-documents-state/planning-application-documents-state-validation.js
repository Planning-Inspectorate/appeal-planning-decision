const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

const planningApplicationDocumentsStateValidation = () => {
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

module.exports = planningApplicationDocumentsStateValidation;
