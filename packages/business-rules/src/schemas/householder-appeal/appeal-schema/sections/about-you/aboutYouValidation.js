const pinsYup = require('../../../../../lib/pins-yup');
const yourDetailsValidation = require('./your-details/your-details-validation');

const aboutYouValidation = () => {
	return pinsYup
		.object()
		.shape({
			yourDetails: yourDetailsValidation()
		})
		.noUnknown(true);
};

module.exports = aboutYouValidation;
