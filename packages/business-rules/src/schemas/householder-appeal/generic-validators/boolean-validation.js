const pinsYup = require('../../../lib/pins-yup');

const booleanValidation = () => {
	return pinsYup.bool().nullable();
};

module.exports = booleanValidation;
