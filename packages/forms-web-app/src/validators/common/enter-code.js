const { body } = require('express-validator');
const isAlphaNumericRegEx = /[^\w_]/g;
const isVowelOrZeroRegEx = /[AEIOUaeiou0]/g;

const ruleEnterCode = () =>
	body('email-code')
		.notEmpty()
		.withMessage('Enter the code we sent to your email address')
		.bail()
		.isLength({ min: 5 })
		.withMessage('Enter the code we sent to your email address')
		.bail()
		.isLength({ max: 5 })
		.withMessage('Enter the code we sent to your email address')
		.bail()
		.custom((value) => {
			return !(value.match(isAlphaNumericRegEx) || value.match(isVowelOrZeroRegEx));
		})
		.withMessage('Enter the code we sent to your email address');

const rules = () => {
	return [ruleEnterCode()];
};

module.exports = {
	rules
};
