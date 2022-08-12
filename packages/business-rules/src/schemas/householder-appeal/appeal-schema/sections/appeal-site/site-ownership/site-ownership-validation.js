const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../../components/boolean-validation');

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
