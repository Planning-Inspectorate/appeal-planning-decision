const { body } = require('express-validator');

const validEnforcementNoticeListedBuildingOptions = ['yes', 'no'];

const ruleEnforcementNoticeListedBuidling = () =>
	body('enforcement-notice-listed-building')
		.notEmpty()
		.withMessage('Select yes if your enforcement notice is about a listed building')
		.bail()
		.isIn(validEnforcementNoticeListedBuildingOptions);

const rules = () => [ruleEnforcementNoticeListedBuidling()];

module.exports = {
	rules,
	validEnforcementNoticeListedBuildingOptions
};
