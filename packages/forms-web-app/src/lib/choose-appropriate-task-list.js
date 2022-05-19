const {
  TYPE_OF_PLANNING_APPLICATION,
  APPLICATION_DECISION,
} = require('../../../business-rules/src/constants');

const pages = {
  fullAppealTaskList: '/full-appeal/submit-appeal/task-list',
  householderPlanningTaskList: '/appellant-submission/task-list',
};

const chooseAppropriateTaskList = (appeal) => {
  const applicationType = appeal.typeOfPlanningApplication;
  const {
    applicationDecision,
    hasPriorApprovalForExistingHome,
    hasHouseholderPermissionConditions,
  } = appeal.eligibility;

  switch (applicationType) {
    case TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING:
      if (applicationDecision === APPLICATION_DECISION.REFUSED) {
        return pages.householderPlanningTaskList;
      }
      return pages.fullAppealTaskList;
    case TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL:
      if (hasPriorApprovalForExistingHome && applicationDecision === APPLICATION_DECISION.REFUSED) {
        return pages.householderPlanningTaskList;
      }
      return pages.fullAppealTaskList;
    case TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS:
      if (
        hasHouseholderPermissionConditions &&
        applicationDecision === APPLICATION_DECISION.REFUSED
      ) {
        return pages.householderPlanningTaskList;
      }
      return pages.fullAppealTaskList;
    default:
      return pages.fullAppealTaskList;
  }
};

module.exports = {
  chooseAppropriateTaskList,
};
