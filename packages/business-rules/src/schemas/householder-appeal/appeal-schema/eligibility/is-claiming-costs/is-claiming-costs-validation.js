const booleanValidation = require('../../../generic-validators/boolean-validation');

const isClaimingCostsValidation = () => {
	return booleanValidation();
};

module.exports = isClaimingCostsValidation;
