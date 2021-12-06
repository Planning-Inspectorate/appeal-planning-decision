const { body } = require('express-validator');

const validEnforcementNoticeOptions = ['yes', 'no'];

const ruleEnforcementNotice = () =>
  body('enforcement-notice')
    .notEmpty()
    .withMessage('Select Yes if you have received an enforcement notice')
    .bail()
    .isIn(validEnforcementNoticeOptions);

const rules = () => [ruleEnforcementNotice()];

module.exports = {
  rules,
  validEnforcementNoticeOptions,
};
