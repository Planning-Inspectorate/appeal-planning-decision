const pinsYup = require('../../../lib/pins-yup');
const appealDetails = require('../../components/appeal-details-validation/appeal-details-validation');
const eligibilityValidation = require('./eligibility/eligibility-validation');

const appealValidationSchema = () => {
	return pinsYup
		.object()
		.noUnknown(true)
		.shape({
			...appealDetails(),
			eligibility: eligibilityValidation()
		});
};

module.exports = appealValidationSchema;
