const { body } = require('express-validator');

const ruleSiteAccessSafety = () =>
  body('site-access-safety')
    .notEmpty()
    .withMessage('Select No if there are no health and safety issues on the appeal site')
    .bail()
    .isIn(['yes', 'no']);

const ruleSiteAccessSafetyConcerns = () =>
  body('site-access-safety-concerns')
    .if(body('site-access-safety').matches('yes'))
    .notEmpty()
    .withMessage('Tell us about any health and safety concerns');

const rules = () => [ruleSiteAccessSafety(), ruleSiteAccessSafetyConcerns()];

module.exports = {
  rules,
};
