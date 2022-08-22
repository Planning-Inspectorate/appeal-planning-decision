const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

const contactDetailsStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			isOriginalApplicant: sectionStateValidation(),
			contact: sectionStateValidation(),
			appealingOnBehalfOf: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = contactDetailsStateValidation;
