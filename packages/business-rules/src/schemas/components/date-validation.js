const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');

const dateValidation = (required = false) => {
	const yupSchema = pinsYup.date().transform(parseDateString);
	return required ? yupSchema.required() : yupSchema.nullable();
};

module.exports = dateValidation;
