const { param } = require('express-validator');

const rules = () => [
	param('id')
		.customSanitizer((value) => decodeURIComponent(value))
		.isEmail()
		.withMessage(`User ID is not in a valid format`)
];

module.exports = {
	rules
};
