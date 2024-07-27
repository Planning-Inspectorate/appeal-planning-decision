const { body } = require('express-validator');

const ruleAddressLine1 = () =>
	body('addressLine1')
		.isLength({ max: 255 })
		.withMessage('Address line 1 must be 255 characters or less');

const ruleAddressLine2 = () =>
	body('addressLine2')
		.isLength({ max: 96 })
		.withMessage('Address line 2 must be 96 characters or less');

const ruleTownCity = () =>
	body('townCity').isLength({ max: 64 }).withMessage('Town or city must be 64 characters or less');

const ruleCounty = () =>
	body('county').isLength({ max: 64 }).withMessage('County must be 64 characters or less');

const rulePostcode = () =>
	body('postcode').isLength({ max: 16 }).withMessage('Postcode must be 16 characters or less');

const rules = () => {
	return [ruleAddressLine1(), ruleAddressLine2(), ruleTownCity(), ruleCounty(), rulePostcode()];
};

module.exports = {
	rules
};
