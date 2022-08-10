const booleanValidation = require('../../../generic-validators/boolean-validation');

const priorApprovalValidation = () => {
	return booleanValidation();
};

module.exports = priorApprovalValidation;
