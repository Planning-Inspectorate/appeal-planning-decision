const { body } = require('express-validator');

const rules = () => {
	return [
		body('listed-building-householder')
			.notEmpty()
			.withMessage('Select yes if your appeal is about a listed building')
			.bail()
	];
};

module.exports = {
	rules
};
