const { param } = require('express-validator');

const rules = () => [
	param('id')
		.custom((value) => {
			return value.match(/^[a-f\d]{24}$/i);
		})
		.withMessage(`User ID is not in a valid format`)
];

module.exports = {
	rules
};
