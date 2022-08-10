const pinsYup = require('../../../../../lib/pins-yup');

const yourAppealValidation = () => {
	return pinsYup.object().shape({
		appealStatement: pinsYup
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
					.noUnknown(true),
				hasSensitiveInformation: pinsYup.bool().nullable().default(null)
			})
			.noUnknown(true),
		otherDocuments: pinsYup
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
					.nullable()
					.default([])
			})
			.noUnknown(true)
	});
};

module.exports = yourAppealValidation;
