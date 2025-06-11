const { body } = require('express-validator');
const { APPLICATION_ABOUT } = require('@pins/business-rules/src/constants');
const validApplicationAboutOptions = Object.values(APPLICATION_ABOUT);

const ruleApplicationAbout = () =>
	body('planningApplicationAbout')
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
