const { body } = require('express-validator');
const { ELIGIBILITY } = require('../../constants');

const validHouseholderPlanningPermissionStatusOptions = [
  ELIGIBILITY.PLANNING_PERMISSION_STATUS.GRANTED,
  ELIGIBILITY.PLANNING_PERMISSION_STATUS.REFUSED,
  ELIGIBILITY.PLANNING_PERMISSION_STATUS.NODECISION,
];

const ruleHouseholderPlanningPermissionStatus = () =>
  body('granted-or-refused-permission')
    .notEmpty()
    .withMessage(
      'Select if your planning permission was granted or refused, or if you have not received a decision'
    )
    .bail()
    .isIn(validHouseholderPlanningPermissionStatusOptions);

const rules = () => [ruleHouseholderPlanningPermissionStatus()];

module.exports = {
  rules,
  validHouseholderPlanningPermissionStatusOptions,
};
