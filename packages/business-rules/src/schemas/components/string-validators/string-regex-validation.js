const pinsYup = require('../../../lib/pins-yup');

const stringRegexValidation = (charCount = 255, required = false) => {
	return required
		? pinsYup.string().trim().max(charCount).required()
		: pinsYup.string().trim().max(charCount).nullable();
};

module.exports = stringRegexValidation;
