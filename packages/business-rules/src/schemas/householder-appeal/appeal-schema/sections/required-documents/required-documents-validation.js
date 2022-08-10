const pinsYup = require('../../../../../lib/pins-yup');

const requiredDocumentsValidation = () => {
	return pinsYup
		.object()
		.shape({
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
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = requiredDocumentsValidation;
