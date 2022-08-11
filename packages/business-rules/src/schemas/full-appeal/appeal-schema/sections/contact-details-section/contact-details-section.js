const pinsYup = require('../../../../../lib/pins-yup');
const { boolValidation } = require('../../../../components/insert/bool-validation');
const { stringValidation } = require('../../../../components/insert/string-validation');

const contactDetailsSectionValidation = () => {
	return pinsYup
		.object()
		.shape({
			isOriginalApplicant: boolValidation(),
			contact: pinsYup
				.object()
				.shape({
					name: pinsYup.lazy((name) => {
						if (name) {
							return pinsYup
								.string()
								.min(2)
								.max(80)
								.matches(/^[a-z\-' ]+$/i)
								.required();
						}
						return stringValidation();
					}),
					companyName: stringValidation(50)
				})
				.noUnknown(true),
			appealingOnBehalfOf: pinsYup
				.object()
				.shape({
					name: pinsYup
						.string()
						.max(80)
						.matches(/^[a-z\-' ]*$/i)
						.nullable(),
					companyName: stringValidation()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = { contactDetailsSectionValidation };
