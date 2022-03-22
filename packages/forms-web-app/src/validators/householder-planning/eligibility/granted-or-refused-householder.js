const {
  constants: { APPLICATION_DECISION },
} = require('@pins/business-rules');
const { body } = require('express-validator');

const validApplicationDecisionOptions = [
  APPLICATION_DECISION.GRANTED,
  APPLICATION_DECISION.REFUSED,
  APPLICATION_DECISION.NODECISIONRECEIVED,
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
