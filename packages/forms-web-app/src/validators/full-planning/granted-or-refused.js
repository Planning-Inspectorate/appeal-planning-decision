const { body } = require('express-validator');
const {
  FULL_PLANNING: { PLANNING_APPLICATION_STATUS },
} = require('../../constants');

const validFullPlanningApplicationStatusOptions = [
  PLANNING_APPLICATION_STATUS.GRANTED,
  PLANNING_APPLICATION_STATUS.REFUSED,
  PLANNING_APPLICATION_STATUS.NODECISION,
];

const ruleFullPlanningApplicationStatus = () =>
  body('granted-or-refused')
    .notEmpty()
    .withMessage(
      'Select if your planning application was granted or refused, or if you have not received a decision'
    )
    .bail()
    .isIn(validFullPlanningApplicationStatusOptions);

const rules = () => [ruleFullPlanningApplicationStatus()];

module.exports = {
  rules,
  validFullPlanningApplicationStatusOptions,
};
