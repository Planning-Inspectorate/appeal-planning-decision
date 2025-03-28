const { body } = require('express-validator');

const ruleComments = () =>
	body('comments')
		.notEmpty()
		.withMessage('Enter your comments')
		.bail()
		.isLength({ min: 1, max: 8000 })
		.withMessage(`Comments must be 8,000 characters or less`);

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
