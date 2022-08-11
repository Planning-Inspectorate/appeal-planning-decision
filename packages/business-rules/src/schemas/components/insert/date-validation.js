const pinsYup = require('../../../lib/pins-yup');
const parseDateString = require('../../../utils/parse-date-string');

const dateValidation = (required) => {
	const validation = pinsYup.date().transform(parseDateString);

	return required ? validation.required() : validation.nullable();
};

module.exports = { dateValidation };
