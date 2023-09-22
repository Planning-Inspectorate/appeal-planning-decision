const { body } = require('express-validator');
const validatePostcode = require('../../lib/valid-postcode');

const ruleAddressLine1 = () =>
	body('site-address-line-one')
		.notEmpty()
		.withMessage('Enter the building and street')
		.bail()
		.isLength({ min: 1, max: 60 })
		.bail()
		.withMessage('The first line of the building and street must be 60 characters or fewer');

const ruleAddressLine2 = () =>
	body('site-address-line-two')
		.isLength({ min: 0, max: 60 })
		.bail()
		.withMessage('The second line of the building and street must be 60 characters or fewer');

const ruleAddressTownCity = () =>
	body('site-town-city')
		.isLength({ min: 0, max: 60 })
		.bail()
		.withMessage('Town or City must be 60 characters or fewer');

const ruleAddressCounty = () =>
	body('site-county')
		.isLength({ min: 0, max: 60 })
		.bail()
		.withMessage('County must be 60 characters or fewer');

const ruleAddressPostCode = () =>
	body('site-postcode')
		.notEmpty()
		.withMessage('Enter the postcode')
		.bail()
		.isLength({ min: 1, max: 8 })
		.bail()
		.withMessage('Postcode must be 8 characters or fewer')
		.bail()
		.custom((postcode) => validatePostcode(postcode, 'Enter a real postcode'));

const rules = () => {
	return [
		ruleAddressLine1(),
		ruleAddressLine2(),
		ruleAddressTownCity(),
		ruleAddressCounty(),
		ruleAddressPostCode()
	];
};

module.exports = {
	rules
};
