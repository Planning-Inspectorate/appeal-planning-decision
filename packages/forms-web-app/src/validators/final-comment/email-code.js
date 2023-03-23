const { body } = require('express-validator');
const {
	validation: {
		characterLimits: { emailCode: emailCodeCharacters }
	}
} = require('../../config');

const rules = () => [
	body('email-code')
		.notEmpty()
		.withMessage('Enter the code')
		.bail()
		.isLength({ min: emailCodeCharacters })
		.withMessage(
			`You've not entered enough numbers, the code must be ${emailCodeCharacters} numbers`
		)
		.bail()
		.isLength({ max: emailCodeCharacters })
		.withMessage(`You've entered too many numbers, the code must be ${emailCodeCharacters} numbers`)
		.bail()
		.isNumeric()
		.withMessage(`Code must be numbers only`)
];

module.exports = {
	rules
};
