const pinsYup = require('../../../lib/pins-yup');

const idStringValidation = (required = false) => {
	return required
		? pinsYup.string().trim().uuid().required()
		: pinsYup.string().trim().uuid().nullable();
};

module.exports = idStringValidation;
