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
    .withMessage('Tell us how access is restricted');

const rules = () => [ruleSiteAccess(), ruleSiteAccessMoreDetail()];

module.exports = {
  rules,
  validSiteAccessOptions,
};
