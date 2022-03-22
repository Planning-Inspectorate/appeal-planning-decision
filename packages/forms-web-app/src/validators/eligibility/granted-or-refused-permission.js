const {
  constants: { APPLICATION_DECISION },
} = require('@pins/business-rules');
const { body } = require('express-validator');

const validHouseholderPlanningPermissionStatusOptions = [
  APPLICATION_DECISION.GRANTED,
  APPLICATION_DECISION.REFUSED,
  APPLICATION_DECISION.NODECISIONRECEIVED,
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
