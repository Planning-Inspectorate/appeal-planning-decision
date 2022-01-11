const { body } = require('express-validator');

const validEnforcementNoticeHouseholderOptions = ['yes', 'no'];

const ruleEnforcementNoticeHouseholder = () =>
  body('enforcement-notice')
    .notEmpty()
    .withMessage('Select yes if you have received an enforcement notice')
    .bail()
    .isIn(validEnforcementNoticeHouseholderOptions);

const rules = () => [ruleEnforcementNoticeHouseholder()];

module.exports = {
  rules,
  validEnforcementNoticeHouseholderOptions,
};
