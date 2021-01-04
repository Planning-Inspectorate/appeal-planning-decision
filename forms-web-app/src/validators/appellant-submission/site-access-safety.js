const { body } = require('express-validator');

const validSiteAccessSafetyOptions = ['yes', 'no'];

const ruleSiteAccessSafety = () =>
  body('site-access-safety')
    .notEmpty()
    .withMessage('Select No if there are no health and safety issues on the appeal site')
    .bail()
    .isIn(validSiteAccessSafetyOptions);

const ruleSiteAccessSafetyConcerns = () =>
  body('site-access-safety-concerns')
    .if(body('site-access-safety').matches('yes'))
    .notEmpty()
    .withMessage('Tell us about any health and safety concerns')
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage('The safety concerns should have maximum 255 characters');

const rules = () => [ruleSiteAccessSafety(), ruleSiteAccessSafetyConcerns()];

module.exports = {
  rules,
  validSiteAccessSafetyOptions,
};
