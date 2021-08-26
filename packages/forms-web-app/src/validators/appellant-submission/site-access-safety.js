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
    .withMessage('Tell us about the health and safety issues')
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage('Health and safety information must be 255 characters or fewer');

const rules = () => [ruleSiteAccessSafety(), ruleSiteAccessSafetyConcerns()];

module.exports = {
  rules,
  validSiteAccessSafetyOptions,
};
