const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../generic-validators/boolean-validation');

const siteOwnershipValidation = () => {
	return pinsYup
		.object()
		.shape({
			ownsWholeSite: booleanValidation(),
			haveOtherOwnersBeenTold: booleanValidation()
		})
		.noUnknown(true);
};

module.exports = siteOwnershipValidation;
