const { body } = require('express-validator');

const ruleYourName = () =>
	body('appellant-name')
		.notEmpty()
		.withMessage('Enter your name')
		.bail()
		.matches(/^[a-z\-' ]+$/i)
		.withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
		.bail()
		.isLength({ min: 2, max: 80 })
		.withMessage('Name must be between 2 and 80 characters');

const rules = () => {
	return [ruleYourName()];
};

module.exports = {
	rules
};
