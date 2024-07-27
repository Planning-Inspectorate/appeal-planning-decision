const { body } = require('express-validator');

const ruleFirstName = () =>
	body('first-name')
		.notEmpty()
		.withMessage('Enter your first name')
		.bail()
		.isLength({ min: 1, max: 250 })
		.withMessage('First name must be 250 characters or less');

const ruleLastName = () =>
	body('last-name')
		.notEmpty()
		.withMessage('Enter your last name')
		.bail()
		.isLength({ min: 1, max: 250 })
		.withMessage('Last name must be 250 characters or less');

const rules = () => {
	return [ruleFirstName(), ruleLastName()];
};

module.exports = {
	rules
};
