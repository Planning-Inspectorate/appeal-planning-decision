const pinsYup = require('../../../lib/pins-yup');

const emailStringValidation = (charCount = 255, required = false) => {
	return required
		? pinsYup.string().email().max(charCount).required()
		: pinsYup.string().email().max(charCount).nullable();
};

module.exports = emailStringValidation;
