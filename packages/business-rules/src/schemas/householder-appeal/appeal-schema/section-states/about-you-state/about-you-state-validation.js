const pinsYup = require('../../../../../lib/pins-yup');
const sectionStateValidation = require('../../../../components/section-state-validation');

const aboutYouStateValidation = () => {
	return pinsYup
		.object()
		.shape({
			yourDetails: sectionStateValidation()
		})
		.noUnknown(true);
};

module.exports = aboutYouStateValidation;
