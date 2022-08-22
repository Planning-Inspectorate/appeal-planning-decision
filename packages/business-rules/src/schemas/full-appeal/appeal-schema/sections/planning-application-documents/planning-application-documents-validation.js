const pinsYup = require('../../../../../lib/pins-yup');

const planningApplicationDocumentsValidation = () => {
	return pinsYup
		.object()
		.shape({
			ownershipCertificate: pinsYup
				.object()
				.shape({
					submittedSeparateCertificate: pinsYup.bool().nullable().default(null),
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true),
			descriptionDevelopmentCorrect: pinsYup
				.object()
				.shape({
					isCorrect: pinsYup.bool().nullable(),
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
					uploadedFiles: pinsYup
						.array()
						.of(
							pinsYup
								.object()
								.shape({
									id: pinsYup.string().trim().uuid().nullable().default(null),
									name: pinsYup.string().trim().max(255).ensure(),
									fileName: pinsYup.string().trim().max(255).ensure(),
									originalFileName: pinsYup.string().trim().max(255).ensure(),
									location: pinsYup.string().trim().nullable(),
									size: pinsYup.number().nullable()
								})
								.noUnknown(true)
						)
						.ensure()
				})
				.noUnknown(true),
			originalApplication: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true),
			decisionLetter: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true),
			designAccessStatement: pinsYup
				.object()
				.shape({
					isSubmitted: pinsYup.bool().nullable(),
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true),
			letterConfirmingApplication: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true),
			originalDecisionNotice: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true)
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = planningApplicationDocumentsValidation;
