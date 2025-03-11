const { body } = require('express-validator');

function validateEmail(email) {
	const pattern = /.+@[^.]*(.*)/;

	const result = pattern.exec(email);

	/* istanbul ignore else */
	if (result && result.length > 1 && result[1].length > 2) {
		return email;
	}

	/* istanbul ignore next */
	throw new Error('Enter an email address in the correct format, like name@example.com');
}

// This rule was used for the email field on the page
const ruleYourEmail = () =>
	body('email-address')
		.notEmpty()
		.withMessage('Enter your email address')
		.bail()
		.trim()
		.isEmail()
		.withMessage('Enter an email address in the correct format, like name@example.com')
		.bail()
		.matches(/^(?=[\w\s])\s*[-+.'\w]*['\w]+@[-.\w]+\.[-.\w]+\s*$/)
		.withMessage('Enter an email address in the correct format, like name@example.com')
		.bail()
		.custom((email) => validateEmail(email));

const rules = () => {
	return [ruleYourEmail()];
};

module.exports = {
	rules
};
