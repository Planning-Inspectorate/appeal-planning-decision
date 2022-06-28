const { body } = require('express-validator');

const validSiteOwnershipCertBOptions = ['yes', 'no'];

const ruleSiteOwnershipCertB = () =>
	body('have-other-owners-been-told')
		.notEmpty()
		.withMessage('Select yes if you have told the other owners')
		.bail()
		.isIn(validSiteOwnershipCertBOptions);

const rules = () => {
	return [ruleSiteOwnershipCertB()];
};

module.exports = {
	rules,
	validSiteOwnershipCertBOptions
};
