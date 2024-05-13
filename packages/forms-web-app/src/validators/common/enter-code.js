const { body } = require('express-validator');
const isAlphaNumericRegEx = /[^\w_]/g;
const isVowelOrZeroRegEx = /[AEIOUaeiou0]/g;

const ruleEnterCode = () =>
	body('email-code')
		.notEmpty()
		.withMessage('Enter the code')
		.bail()
		.isLength({ min: 5 })
		.withMessage('Enter the code')
		.bail()
		.isLength({ max: 5 })
		.withMessage('Enter the code')
		.bail()
		.custom((value) => {
			return !(value.match(isAlphaNumericRegEx) || value.match(isVowelOrZeroRegEx));
		})
		.withMessage('Enter the code');

const rules = () => {
	return [ruleEnterCode()];
};

module.exports = {
	rules
};
