const { body } = require('express-validator');
const isAlphaNumericRegEx = /[^\w_]/g;
const isVowelOrZeroRegEx = /[AEIOUaeiou0]/g;

const ruleEnterCode = () =>
	body('email-code')
		.notEmpty()
		.withMessage('Enter the code')
		.bail()
		.isLength({ min: 5 })
		.withMessage('You’ve not entered enough characters, the code must be 5 characters')
		.bail()
		.isLength({ max: 5 })
		.withMessage('You’ve entered too many characters, the code must be 5 characters')
		.bail()
		.custom((value) => {
			return !(value.match(isAlphaNumericRegEx) || value.match(isVowelOrZeroRegEx));
		})
		.withMessage(
			'Code must contain numbers from 1-9 and letters from the alphabet exluding vowels'
		);

const rules = () => {
	return [ruleEnterCode()];
};

module.exports = {
	rules
};
