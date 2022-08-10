const pinsYup = require('../../../lib/pins-yup');
const parseDateString = require('../../../utils/parse-date-string');

const dateValidation = (required) => {
	if (required) {
		return pinsYup.date().transform(parseDateString).required();
	}
	return pinsYup.date().transform(parseDateString).nullable();
};

module.exports = dateValidation;
