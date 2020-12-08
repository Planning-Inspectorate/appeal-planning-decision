const { body } = require('express-validator');

const ruleSiteAccess = () =>
  body('site-access')
    .notEmpty()
    .withMessage('Select Yes if the appeal site can be seen from a public road')
    .bail()
    .isIn(['yes', 'no']);

const ruleSiteAccessMoreDetail = () =>
  body('site-access-more-detail')
    .if(body('site-access').matches('no'))
    .notEmpty()
    .withMessage('Tell us how access is restricted');

const rules = () => [ruleSiteAccess(), ruleSiteAccessMoreDetail()];

module.exports = {
  rules,
};
