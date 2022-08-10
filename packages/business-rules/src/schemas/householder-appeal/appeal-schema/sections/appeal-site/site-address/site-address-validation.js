const pinsYup = require('../../../../../../lib/pins-yup');

const siteAddressValidation = () => {
	return pinsYup
		.object()
		.shape({
			addressLine1: pinsYup.string().max(60).nullable(),
			addressLine2: pinsYup.string().max(60).nullable(),
			town: pinsYup.string().max(60).nullable(),
			county: pinsYup.string().max(60).nullable(),
			postcode: pinsYup.string().max(8).nullable()
		})
		.noUnknown(true);
};

module.exports = siteAddressValidation;
