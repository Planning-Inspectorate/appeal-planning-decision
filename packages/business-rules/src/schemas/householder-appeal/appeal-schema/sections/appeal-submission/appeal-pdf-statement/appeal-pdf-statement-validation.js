const pinsYup = require('../../../../../../lib/pins-yup');
const uploadedFileValidation = require('../../../../../components/uploadedFileValidation');

const appealPdfStatementValidation = () => {
	return pinsYup
		.object()
		.shape({
			uploadedFile: uploadedFileValidation()
		})
		.noUnknown(true);
};

module.exports = appealPdfStatementValidation;
