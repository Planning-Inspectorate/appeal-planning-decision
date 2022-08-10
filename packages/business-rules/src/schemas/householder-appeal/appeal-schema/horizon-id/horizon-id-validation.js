const pinsYup = require('../../../../lib/pins-yup');

const horizonIdValidation = () => {
	return pinsYup.string().trim().max(20).nullable();
};

module.exports = horizonIdValidation;
