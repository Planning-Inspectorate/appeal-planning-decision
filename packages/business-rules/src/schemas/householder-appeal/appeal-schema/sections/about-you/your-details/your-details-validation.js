const pinsYup = require('../../../../../../lib/pins-yup');
const booleanValidation = require('../../../../generic-validators/boolean-validation');
const appealingOnBehalfOfValidation = require('./appealing-on-behalf-of/appealing-on-behalf-of-validation');
const nameValidation = require('./name/name-validation');

const yourDetailsValidation = () => {
	return pinsYup.object().shape({
		isOriginalApplicant: booleanValidation(),
		name: nameValidation(),
		appealingOnBehalfOf: appealingOnBehalfOfValidation()
	});
};

module.exports = yourDetailsValidation;
