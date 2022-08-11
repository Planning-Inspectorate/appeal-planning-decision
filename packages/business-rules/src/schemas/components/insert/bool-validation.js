const pinsYup = require('../../../lib/pins-yup');

const boolValidation = () => {
	return pinsYup.bool().nullable();
};

module.exports = { boolValidation };
