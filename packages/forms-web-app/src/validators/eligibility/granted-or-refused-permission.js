const { body } = require('express-validator');
const { eligibility } = require('../../constants');

const validHouseholderPlanningPermissionStatusOptions = [
  eligibility.planningPermissionStatus.GRANTED,
  eligibility.planningPermissionStatus.REFUSED,
  eligibility.planningPermissionStatus.NODECISION,
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
