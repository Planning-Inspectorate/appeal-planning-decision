const { body } = require('express-validator');

const rules = () => {
	return [
		body('local-planning-department')
			.notEmpty()
			.withMessage('Enter the local planning authority')
			.bail()
	];
};

module.exports = {
	rules
};
