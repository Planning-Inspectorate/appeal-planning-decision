const { body } = require('express-validator');
const {
  HOUSEHOLDER_PLANNING: { PLANNING_APPLICATION_STATUS },
} = require('../../../constants');

const validApplicationDecisionOptions = [
  PLANNING_APPLICATION_STATUS.GRANTED,
  PLANNING_APPLICATION_STATUS.REFUSED,
  PLANNING_APPLICATION_STATUS.NODECISION,
];

const ruleApplicationDecision = () =>
  body('granted-or-refused')
    .notEmpty()
    .withMessage(
      'Select if your planning application was granted or refused, or if you have not received a decision'
    )
    .bail()
    .isIn(validApplicationDecisionOptions);

const rules = () => [ruleApplicationDecision()];

module.exports = {
  rules,
  validApplicationDecisionOptions,
};
