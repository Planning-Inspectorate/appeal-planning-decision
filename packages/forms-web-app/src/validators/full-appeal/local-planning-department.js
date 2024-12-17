const { body } = require('express-validator');

const rules = () => {
	return [
		body('local-planning-department')
			.notEmpty()
			.withMessage('Enter the name of the local planning department')
			.bail()
	];
};

module.exports = {
	rules
};
