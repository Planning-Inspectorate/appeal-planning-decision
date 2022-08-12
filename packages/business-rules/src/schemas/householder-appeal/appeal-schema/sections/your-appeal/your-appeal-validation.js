const pinsYup = require('../../../../../lib/pins-yup');
const uploadedFileValidation = require('../../../../components/uploadedFileValidation');

const yourAppealValidation = () => {
	return pinsYup.object().shape({
		appealStatement: pinsYup
			.object()
			.shape({
				uploadedFile: uploadedFileValidation(),
				hasSensitiveInformation: pinsYup.bool().nullable().default(null)
			})
			.noUnknown(true),
		otherDocuments: pinsYup
			.object()
			.shape({
				uploadedFiles: pinsYup.array().of(uploadedFileValidation()).nullable().default([])
			})
			.noUnknown(true)
	});
};

module.exports = yourAppealValidation;
