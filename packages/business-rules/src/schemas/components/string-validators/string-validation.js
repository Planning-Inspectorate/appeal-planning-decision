const pinsYup = require('../../../lib/pins-yup');

const stringValidation = (required = false) => {
	return required ? pinsYup.string().required() : pinsYup.string().nullable();
};

module.exports = stringValidation;
