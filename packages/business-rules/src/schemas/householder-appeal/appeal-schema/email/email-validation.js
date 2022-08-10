const pinsYup = require('../../../../lib/pins-yup');

const emailValidation = () => {
	return pinsYup.string().email().max(255).nullable();
};

module.exports = emailValidation;
