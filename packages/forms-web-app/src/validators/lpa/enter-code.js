const { body } = require('express-validator');

const ruleEnterCode = () =>
	body('email-code')
		.notEmpty()
		.withMessage('Enter the code')
		.bail()
		.isNumeric()
		.withMessage('The code must be 5 numbers')
		.bail()
		.isLength({ min: 5 })
		.withMessage('You’ve not entered enough numbers, the code must be 5 numbers')
		.bail()
		.isLength({ max: 5 })
		.withMessage('You’ve entered too many numbers, the code must be 5 numbers');

const rules = () => {
	return [ruleEnterCode()];
};

module.exports = {
	rules
};
