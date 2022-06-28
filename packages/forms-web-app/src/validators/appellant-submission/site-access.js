const { body } = require('express-validator');

const validSiteAccessOptions = ['yes', 'no'];

const ruleSiteAccess = () =>
	body('site-access')
		.notEmpty()
		.withMessage('Select Yes if the appeal site can be seen from a public road')
		.bail()
		.isIn(validSiteAccessOptions);

const ruleSiteAccessMoreDetail = () =>
	body('site-access-more-detail')
		.if(body('site-access').matches('no'))
		.notEmpty()
		.withMessage('Tell us how access is restricted')
		.bail()
		.isLength({ min: 1, max: 255 })
		.withMessage('How access is restricted must be 255 characters or less');

const rules = () => [ruleSiteAccess(), ruleSiteAccessMoreDetail()];

module.exports = {
	rules,
	validSiteAccessOptions
};
