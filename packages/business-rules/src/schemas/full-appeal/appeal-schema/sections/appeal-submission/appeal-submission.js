const pinsYup = require('../../../../../lib/pins-yup');
const { uploadedFileValidation } = require('../../../../components/insert/uploadedFileValidation');

const appealSubmissionValidation = () => {
	return pinsYup
		.object()
		.shape({
			appealPDFStatement: pinsYup
				.object()
				.shape({
					uploadedFile: uploadedFileValidation()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = { appealSubmissionValidation };
