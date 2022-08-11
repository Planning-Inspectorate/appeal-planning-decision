const pinsYup = require('../../../../../lib/pins-yup');
const { boolValidation } = require('../../../../components/insert/bool-validation');
const { uploadedFileValidation } = require('../../../../components/insert/uploadedFileValidation');

const documentValidation = () => {
	return pinsYup
		.object()
		.shape({
			uploadedFile: uploadedFileValidation()
		})
		.noUnknown(true);
};

const planningApplicationDocumentsSectionValidation = () => {
	return pinsYup
		.object()
		.shape({
			ownershipCertificate: pinsYup
				.object()
				.shape({
					submittedSeparateCertificate: boolValidation().default(null),
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true),
			descriptionDevelopmentCorrect: pinsYup
				.object()
				.shape({
					isCorrect: boolValidation(),
					details: pinsYup.lazy((details) => {
						return pinsYup.mixed().conditionalText({
							fieldValue: details,
							fieldName: 'details',
							targetFieldName: 'description-development-correct',
							emptyError:
								"Select yes if your proposed development haven't changed after you submitted your application",
							tooLongError: 'How proposed development changed must be $maxLength characters or less'
						});
					})
				})
				.noUnknown(true),
			plansDrawingsSupportingDocuments: pinsYup
				.object()
				.shape({
					uploadedFiles: pinsYup.array().of(uploadedFileValidation()).ensure()
				})
				.noUnknown(true),
			originalApplication: documentValidation(),
			decisionLetter: documentValidation(),
			designAccessStatement: pinsYup
				.object()
				.shape({
					isSubmitted: pinsYup.bool().nullable(),
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true),
			letterConfirmingApplication: documentValidation(),
			originalDecisionNotice: documentValidation()
		})
		.noUnknown(true);
};

module.exports = { planningApplicationDocumentsSectionValidation };
