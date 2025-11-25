const { body } = require('express-validator');

const ruleEnforcementReferenceNumber = () =>
	body('reference-number')
		.notEmpty()
		.withMessage('Enter the reference number on the enforcement notice')
		.bail()
		.isLength({ min: 1, max: 250 })
		.withMessage('Reference number must be 250 characters or less');

const rules = () => {
	return [ruleEnforcementReferenceNumber()];
};

module.exports = {
	rules
};
