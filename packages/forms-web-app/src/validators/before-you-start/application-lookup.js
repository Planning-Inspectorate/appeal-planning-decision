const { body } = require('express-validator');

const rules = () => {
	return [
		body('application-number').trim().notEmpty().withMessage('Enter a valid application number')
	];
};

module.exports = {
	rules
};
