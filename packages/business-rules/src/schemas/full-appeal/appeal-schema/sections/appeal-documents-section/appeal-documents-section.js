const { PLANNING_OBLIGATION_STATUS_OPTION } = require('../../../../../constants');
const { uploadedFileValidation } = require('../../../../components/insert/uploadedFileValidation');
const pinsYup = require('../../../../../lib/pins-yup');
const { boolValidation } = require('../../../../components/insert/bool-validation');

const planningObligationStatusOption = () => {
	return pinsYup.lazy((planningObligationStatus) => {
		if (planningObligationStatus) {
			return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
		}
		return pinsYup.string().nullable();
	});
};

const appealDocumentsSectionValidation = () => {
	return pinsYup
		.object()
		.shape({
			appealStatement: pinsYup
				.object()
				.shape({
					uploadedFile: uploadedFileValidation(),
					hasSensitiveInformation: boolValidation().default(null)
				})
				.noUnknown(true),
			plansDrawings: pinsYup
				.object()
				.shape({
					hasPlansDrawings: boolValidation().default(null),
					uploadedFiles: pinsYup.array().of(uploadedFileValidation()).ensure()
				})
				.noUnknown(true),
			planningObligations: pinsYup.object().shape({
				plansPlanningObligation: boolValidation().default(null),
				planningObligationStatus: planningObligationStatusOption()
			}),
			draftPlanningObligations: pinsYup.object().shape({
				plansPlanningObligation: boolValidation().default(null),
				planningObligationStatus: planningObligationStatusOption()
			}),
			planningObligationDeadline: pinsYup.object().shape({
				plansPlanningObligation: boolValidation().default(null),
				planningObligationStatus: planningObligationStatusOption()
			}),
			supportingDocuments: pinsYup
				.object()
				.shape({
					hasSupportingDocuments: boolValidation().default(null),
					uploadedFiles: pinsYup.array().of(uploadedFileValidation()).ensure()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = { appealDocumentsSectionValidation };
