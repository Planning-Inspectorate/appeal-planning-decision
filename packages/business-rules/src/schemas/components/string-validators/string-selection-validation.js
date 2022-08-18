const pinsYup = require('../../../lib/pins-yup');

const stringSelectionValidation = (values = []) => {
	return pinsYup.string().oneOf(values);
};

module.exports = stringSelectionValidation;
