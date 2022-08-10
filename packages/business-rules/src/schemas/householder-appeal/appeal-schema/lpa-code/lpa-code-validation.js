const pinsYup = require('../../../../lib/pins-yup');

const lpaCodeValidation = () => {
	return pinsYup.string().trim().max(20).nullable();
};

module.exports = lpaCodeValidation;
