const pinsYup = require('../../../lib/pins-yup');
const { stringValidation } = require('./string-validation');

const uploadedFileValidation = () => {
	return pinsYup
		.object()
		.shape({
			id: pinsYup.string().trim().uuid().nullable().default(null),
			name: stringValidation(255, true),
			fileName: stringValidation(255, true),
			originalFileName: stringValidation(255, true),
			location: pinsYup.string().trim().nullable(),
			size: pinsYup.number().nullable()
		})
		.noUnknown(true);
};

module.exports = { uploadedFileValidation };
