const pinsYup = require('../../../../lib/pins-yup');

const idValidation = () => {
	return pinsYup.string().uuid().required();
};

module.exports = idValidation;
