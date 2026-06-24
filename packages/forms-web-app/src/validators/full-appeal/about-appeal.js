const { body } = require('express-validator');
const {
	constants: { TYPE_OF_PLANNING_APPLICATION }
} = require('@pins/business-rules');

const rules = () => {
	return [
		body('type-of-planning-application')
			.notEmpty()
			.withMessage('Select which option your appeal is about')
			.bail()
			.isIn(Object.values(TYPE_OF_PLANNING_APPLICATION))
			.withMessage('Select which option your appeal is about')
	];
};

module.exports = {
	rules
};
