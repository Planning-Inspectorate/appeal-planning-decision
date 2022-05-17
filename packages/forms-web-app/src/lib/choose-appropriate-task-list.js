const {
  TYPE_OF_PLANNING_APPLICATION,
  APPLICATION_DECISION,
} = require('../../../business-rules/src/constants');

const pages = {
  [`${TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL}`]: '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING}`]: '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS}`]: '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING}_${APPLICATION_DECISION.GRANTED}`]:
    '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING}_${APPLICATION_DECISION.REFUSED}`]:
    '/appellant-submission/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING}_${APPLICATION_DECISION.NODECISIONRECEIVED}`]:
    '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL}_${APPLICATION_DECISION.GRANTED}`]:
    '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL}_${APPLICATION_DECISION.REFUSED}`]:
    '/appellant-submission/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL}_${APPLICATION_DECISION.NODECISIONRECEIVED}`]:
    '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS}_${APPLICATION_DECISION.GRANTED}`]:
    '/full-appeal/submit-appeal/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS}_${APPLICATION_DECISION.REFUSED}`]:
    '/appellant-submission/task-list',
  [`${TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS}_${APPLICATION_DECISION.NODECISIONRECEIVED}`]:
    '/full-appeal/submit-appeal/task-list',
};

const chooseAppropriateTaskList = (applicationType, applicationDecision) => {
  switch (applicationType) {
    case TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL:
    case TYPE_OF_PLANNING_APPLICATION.OUTLINE_PLANNING:
    case TYPE_OF_PLANNING_APPLICATION.RESERVED_MATTERS:
      return pages[applicationType];
    default:
      return pages[`${applicationType}_${applicationDecision}`];
  }
};

module.exports = {
  chooseAppropriateTaskList,
};
