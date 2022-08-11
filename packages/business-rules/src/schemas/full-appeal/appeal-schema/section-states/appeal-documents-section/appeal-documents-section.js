const pinsYup = require('../../../../../lib/pins-yup');
const {
	sectionStateValidation
} = require('../../../../components/insert/section-state-validation');

const appealDocumentsSectionStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			appealStatement: sectionStateValidation(),
			plansDrawings: sectionStateValidation(),
			newPlansDrawings: sectionStateValidation(),
			plansPlanningObligation: sectionStateValidation(),
			planningObligationStatus: sectionStateValidation(),
			planningObligationDocuments: sectionStateValidation(),
			planningObligationDeadline: sectionStateValidation(),
			draftPlanningObligations: sectionStateValidation(),
			supportingDocuments: sectionStateValidation(),
			newSupportingDocuments: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = { appealDocumentsSectionStateValidation };
