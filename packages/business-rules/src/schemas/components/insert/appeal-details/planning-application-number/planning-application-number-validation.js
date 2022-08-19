const pinsYup = require('../../../../../lib/pins-yup');

const planningApplicationNumberValidation = () => {
	return pinsYup.string().max(30).nullable();
};

module.exports = planningApplicationNumberValidation;
