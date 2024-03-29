const pinsYup = require('../../../../../../../lib/pins-yup');

const nameValidation = () => {
	return pinsYup.lazy((name) => {
		if (name) {
			return pinsYup
				.string()
				.min(2)
				.max(80)
				.matches(/^[a-z\-' ]+$/i)
				.required();
		}
		return pinsYup.string().nullable();
	});
};

module.exports = nameValidation;
