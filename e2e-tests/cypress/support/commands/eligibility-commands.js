Cypress.Commands.add(
  'provideDecisionDate',
  require('../eligibility-decision-date/provideDecisionDate'),
);

Cypress.Commands.add(
  'confirmDecisionDate',
  require('../eligibility-decision-date/confirmDecisionDate'),
);

Cypress.Commands.add(
  'confirmProvidedDecisionDateWasAccepted',
  require('../eligibility-decision-date/confirmProvidedDecisionDateWasAccepted'),
);

Cypress.Commands.add(
  'confirmProvidedDecisionDateWasRejected',
  require('../eligibility-decision-date/confirmProvidedDecisionDateWasRejected'),
);

Cypress.Commands.add(
  'confirmProvidedDecisionDateError',
  require('../eligibility-decision-date/confirmProvidedDecisionDateError'),
);

Cypress.Commands.add(
  'confirmProvidedDecisionDateErrorHighlight',
  require('../eligibility-decision-date/confirmProvidedDecisionDateErrorHighlight'),
);

Cypress.Commands.add(
  'clickReEnterTheDecisionDate',
  require('../eligibility-decision-date-passed/clickReEnterTheDecisionDate'),
);

Cypress.Commands.add(
  'provideLocalPlanningDepartment',
  require('../eligibility-local-planning-department/provideLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'selectLocalPlanningDepartmentWithoutJs',
  require('../eligibility-local-planning-department/selectLocalPlanningDepartmentWithoutJs'),
);

Cypress.Commands.add(
  'provideIneligibleLocalPlanningDepartment',
  require('../eligibility-local-planning-department/provideIneligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'selectIneligibleLocalPlanningDepartmentWithoutJs',
  require('../eligibility-local-planning-department/selectIneligibleLocalPlanningDepartmentWithoutJs'),
);

Cypress.Commands.add(
  'selectEligibleLocalPlanningDepartmentWithoutJs',
  require('../eligibility-local-planning-department/selectEligibleLocalPlanningDepartmentWithoutJs'),
);

Cypress.Commands.add(
  'provideEligibleLocalPlanningDepartment',
  require('../eligibility-local-planning-department/provideEligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'confirmIneligibleLocalPlanningDepartment',
  require('../eligibility-local-planning-department/confirmIneligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'confirmEligibleLocalPlanningDepartment',
  require('../eligibility-local-planning-department/confirmEligibleLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'confirmEligibleLocalPlanningDepartmentWithoutJs',
  require('../eligibility-local-planning-department/confirmEligibleLocalPlanningDepartmentWithoutJs'),
);

Cypress.Commands.add(
  'confirmLocalPlanningDepartmentIsRequired',
  require('../eligibility-local-planning-department/confirmLocalPlanningDepartmentIsRequired'),
);

Cypress.Commands.add(
  'confirmLocalPlanningDepartmentIsNotParticipating',
  require('../eligibility-local-planning-department/confirmLocalPlanningDepartmentIsNotParticipating'),
);

Cypress.Commands.add(
  'confirmPlanningDepartmentSelected',
  require('../eligibility-local-planning-department/confirmPlanningDepartmentSelected'),
);

Cypress.Commands.add(
  'confirmPlanningDepartmentSelectedWithoutJs',
  require('../eligibility-local-planning-department/confirmPlanningDepartmentSelectedWithoutJs'),
);

Cypress.Commands.add(
  'confirmRedirectToExternalService',
  require('../eligibility-local-planning-department/confirmRedirectToExternalService'),
);

Cypress.Commands.add(
  'confirmProvidedLocalPlanningDepartmentWasAccepted',
  require('../eligibility-local-planning-department/confirmProviedLocalPlanningDepartmentWasAccepted'),
);

Cypress.Commands.add(
  'provideEnforcementNoticeAnswer',
  require('../eligibility-enforcement-notice/provideEnforcementNoticeAnswer'),
);

Cypress.Commands.add(
  'confirmThatEnforcementNoticeAnswerIsRequired',
  require('../eligibility-enforcement-notice/confirmThatEnforcementNoticeAnswerIsRequired'),
);

Cypress.Commands.add(
  'confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals',
  require('../eligibility-enforcement-notice/confirmProgressHaltedAsServiceIsOnlyForHouseholderPlanningAppeals'),
);

Cypress.Commands.add(
  'confirmProgressIsMadeToListingBuildingEligibilityQuestion',
  require('../eligibility-enforcement-notice/confirmProgressIsMadeToListingBuildingEligibilityQuestion'),
);

Cypress.Commands.add('provideCostsAnswerNo', require('../eligibility-costs/provideCostsAnswerNo'));

Cypress.Commands.add(
  'provideCostsAnswerYes',
  require('../eligibility-costs/provideCostsAnswerYes'),
);

Cypress.Commands.add(
  'confirmAcpLinkDisplayed',
  require('../eligibility-costs/confirmAcpLinkDisplayed'),
);

Cypress.Commands.add(
  'confirmGuidanceLinkDisplayed',
  require('../eligibility-costs/confirmGuidanceLinkDisplayed'),
);

Cypress.Commands.add(
  'provideHouseholderAnswerNo',
  require('../eligibility-householder/provideHouseholderAnswerNo'),
);

Cypress.Commands.add(
  'provideHouseholderAnswerYes',
  require('../eligibility-householder/provideHouseholderAnswerYes'),
);

Cypress.Commands.add(
  'provideHouseholderPlanningPermissionStatusRefused',
  require('../eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusRefused'),
);

Cypress.Commands.add(
  'provideHouseholderPlanningPermissionStatusGranted',
  require('../eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusGranted')
);

Cypress.Commands.add(
  'provideHouseholderPlanningPermissionStatusNoDecision',
  require('../eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusNoDecision')
);

Cypress.Commands.add('accessDetails', require('../eligibility-householder/accessDetails'));

Cypress.Commands.add(
  'confirmDetailsDisplayed',
  require('../eligibility-householder/confirmDetailsDisplayed'),
);
