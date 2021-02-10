const { body } = require('express-validator');

const validHouseholderPlanningPermissionOptions = ['yes', 'no'];

const ruleHouseholderPlanningPermission = () =>
  body('householder-planning-permission')
    .notEmpty()
    .withMessage('Select Yes if you applied for householder planning permission')
    .bail()
    .isIn(validHouseholderPlanningPermissionOptions);

const rules = () => [ruleHouseholderPlanningPermission()];

module.exports = {
  rules,
  validHouseholderPlanningPermissionOptions,
};
