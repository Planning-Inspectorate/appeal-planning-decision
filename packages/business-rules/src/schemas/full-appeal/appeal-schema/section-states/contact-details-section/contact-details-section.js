const pinsYup = require('../../../../../lib/pins-yup');
const {
	sectionStateValidation
} = require('../../../../components/insert/section-state-validation');

const contactDetailsSectionStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			isOriginalApplicant: sectionStateValidation(),
			contact: sectionStateValidation(),
			appealingOnBehalfOf: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = { contactDetailsSectionStateValidation };
