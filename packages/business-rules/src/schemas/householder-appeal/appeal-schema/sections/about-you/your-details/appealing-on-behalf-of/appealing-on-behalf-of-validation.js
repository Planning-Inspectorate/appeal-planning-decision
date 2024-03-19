const pinsYup = require('../../../../../../../lib/pins-yup');

const appealingOnBehalfOfValidation = () => {
	return pinsYup.string().max(80).nullable();
};

module.exports = appealingOnBehalfOfValidation;
