const { body } = require('express-validator');

const validApplicationAboutOptions = [
	'change_of_use',
	'change_units_in_building',
	'not_wholly_ground_floor',
	'gross_internal_area',
	'none_of_these'
];

const ruleApplicationAbout = () =>
	body('application-about')
		.notEmpty()
		.withMessage('Select if your application was about any of the following')
		.bail()
		.custom((value) => {
			const selectedOptions = Array.isArray(value) ? value : [value];
			return selectedOptions.every((option) => validApplicationAboutOptions.includes(option));
		})
		.withMessage('Select if your application was about any of the following')
		.bail();

const rules = () => [ruleApplicationAbout()];

module.exports = {
	rules,
	validApplicationAboutOptions
};
