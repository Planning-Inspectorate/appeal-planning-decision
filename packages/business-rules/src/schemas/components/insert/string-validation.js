const pinsYup = require('../../../lib/pins-yup');

const stringValidation = (maxLength, ensure) => {
	if (maxLength) {
		const validation = pinsYup.string().trim().max(maxLength);
		return ensure ? validation.ensure() : validation.nullable();
	}
	return pinsYup.string().nullable();
};

const noTrimStringValidation = (maxLength) => {
	return pinsYup.string().max(maxLength).nullable();
};

module.exports = { stringValidation, noTrimStringValidation };
