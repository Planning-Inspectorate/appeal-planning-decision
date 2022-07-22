const { body } = require('express-validator');

const ruleEnterCode = () =>
	body('email-code')
		.notEmpty()
		.withMessage('The code must be 5 numbers')
		.bail()
		.isLength(5)
		.bail()
		.isNumeric()
		.withMessage('The code must be 5 numbers');

const rules = () => {
	return [ruleEnterCode()];
};

module.exports = {
	rules
};
