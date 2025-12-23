const { body } = require('express-validator');

const rules = () => {
	return [
		body('confirm-application-number').notEmpty().withMessage('Confirm your application number')
	];
};

module.exports = {
	rules
};
