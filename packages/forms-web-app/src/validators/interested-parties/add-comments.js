const { body } = require('express-validator');

const ruleComments = () =>
	body('comments')
		.notEmpty()
		.withMessage('Enter your comments')
		.bail()
		.matches(/^[a-z0-9\-' ]+$/i)
		.withMessage(
			'Comments must only include letters a to z, numbers 0 to 9, hyphens, spaces and apostrophes'
		)
		.bail()
		.isLength({ min: 1, max: 1000 })
		.withMessage('Comments must be 1000 characters or less');

const ruleCommentsConfirmation = () =>
	body('comments-confirmation')
		.notEmpty()
		.withMessage('Select that you have not included any sensitive information in your comments.');

const rules = () => {
	return [ruleComments(), ruleCommentsConfirmation()];
};

module.exports = {
	rules
};
