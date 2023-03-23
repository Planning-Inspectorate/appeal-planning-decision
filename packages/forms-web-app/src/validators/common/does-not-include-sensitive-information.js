const { body } = require('express-validator');

const rule = (
	errorMessage = 'Select to confirm that you have not included any sensitive information'
) => {
	return body('does-not-include-sensitive-information')
		.notEmpty()
		.withMessage(errorMessage)
		.bail()
		.equals('i-confirm');
};

module.exports = {
	rule
};
