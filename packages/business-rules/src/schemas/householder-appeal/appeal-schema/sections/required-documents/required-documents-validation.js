const pinsYup = require('../../../../../lib/pins-yup');
const uploadedFileValidation = require('../../../../components/uploadedFileValidation');

const requiredDocumentsValidation = () => {
	return pinsYup
		.object()
		.shape({
			originalApplication: pinsYup
				.object()
				.shape({
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true),
			decisionLetter: pinsYup
				.object()
				.shape({
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = requiredDocumentsValidation;
