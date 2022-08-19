const pinsYup = require('../../../../lib/pins-yup');

const idValidation = () => {
	return pinsYup.string().trim().uuid().required();
};

module.exports = idValidation;
