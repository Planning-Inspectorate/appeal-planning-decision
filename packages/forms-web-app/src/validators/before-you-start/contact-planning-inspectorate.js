const { body } = require('express-validator');

const validContactPlanningInspectorateOptions = ['yes', 'no'];

const ruleContactPlanningInspectorate = () =>
	body('contact-planning-inspectorate')
		.notEmpty()
		.withMessage(
			'Select yes if you contacted the Planning Inspectorate to tell them you will appeal the enforcement notice'
		)
		.bail()
		.isIn(validContactPlanningInspectorateOptions);

const rules = () => [ruleContactPlanningInspectorate()];

module.exports = {
	rules,
	validContactPlanningInspectorateOptions
};
