const pinsYup = require('../../../../../lib/pins-yup');

const contactDetailsValidation = () => {
	return pinsYup
		.object()
		.shape({
			isOriginalApplicant: pinsYup.bool().nullable(),
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
						return pinsYup.string().nullable();
					}),
					companyName: pinsYup.string().max(50).nullable()
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
					companyName: pinsYup.string().nullable()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = contactDetailsValidation;
