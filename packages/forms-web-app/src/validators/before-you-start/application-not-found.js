const { body } = require('express-validator');

const validConfirmOptions = ['yes', 'no'];

const rules = () => {
	return [
		body('confirm-application-number')
			.trim()
			.notEmpty()
			.withMessage('Confirm your application number')
			.isIn(validConfirmOptions)
			.withMessage('Confirm your application number')
	];
};

module.exports = {
	rules
};
