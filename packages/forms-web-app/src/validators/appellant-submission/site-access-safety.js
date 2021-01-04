const { body } = require('express-validator');

const validSiteAccessSafetyOptions = ['yes', 'no'];

const ruleSiteAccessSafety = () =>
  body('site-access-safety')
    .notEmpty()
    .withMessage('Select yes if there are any health and safety issues')
    .bail()
    .isIn(validSiteAccessSafetyOptions);

const ruleSiteAccessSafetyConcerns = () =>
  body('site-access-safety-concerns')
    .if(body('site-access-safety').matches('yes'))
    .notEmpty()
    .withMessage('Enter details of the health and safety concerns')
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage('The safety concerns should have maximum 255 characters');

const rules = () => [ruleSiteAccessSafety(), ruleSiteAccessSafetyConcerns()];

module.exports = {
  rules,
  validSiteAccessSafetyOptions,
};
