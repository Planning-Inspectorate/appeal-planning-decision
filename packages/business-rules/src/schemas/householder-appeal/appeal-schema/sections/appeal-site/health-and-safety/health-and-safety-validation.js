const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../../components/boolean-validation');

const healthAndSafetyValidation = () => {
	return pinsYup
		.object()
		.shape({
			hasIssues: booleanValidation(),
			healthAndSafetyIssues: pinsYup.string().max(255).ensure()
		})
		.noUnknown(true);
};

module.exports = healthAndSafetyValidation;
