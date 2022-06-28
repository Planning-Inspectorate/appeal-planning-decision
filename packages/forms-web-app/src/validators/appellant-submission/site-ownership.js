const { body } = require('express-validator');

const validSiteOwnershipOptions = ['yes', 'no'];

const ruleSiteOwnership = () =>
	body('site-ownership')
		.notEmpty()
		.withMessage('Select yes if you own the whole appeal site')
		.bail()
		.isIn(validSiteOwnershipOptions);

const rules = () => {
	return [ruleSiteOwnership()];
};

module.exports = {
	rules,
	validSiteOwnershipOptions
};
