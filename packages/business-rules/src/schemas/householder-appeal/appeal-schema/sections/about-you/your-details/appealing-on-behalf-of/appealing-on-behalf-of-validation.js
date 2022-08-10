const pinsYup = require('../../../../../../../lib/pins-yup');

const appealingOnBehalfOfValidation = () => {
	return pinsYup
		.string()
		.max(80)
		.matches(/^[a-z\-' ]*$/i)
		.nullable();
};

module.exports = appealingOnBehalfOfValidation;
