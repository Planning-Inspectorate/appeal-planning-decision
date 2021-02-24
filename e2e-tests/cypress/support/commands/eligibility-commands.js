Cypress.Commands.add(
  'provideDecisionDate',
  require('../eligibility-decision-date/provideDecisionDate'),
);

Cypress.Commands.add(
  'confirmDecisionDate',
  require('../eligibility-decision-date/confirmDecisionDate'),
);

Cypress.Commands.add(
  'accessConfirmHavingNoDecisionDate',
  require('../eligibility-decision-date/accessConfirmHavingNoDecisionDate'),
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
  'confirmProvidedDecisionDateWasInvalid',
  require('../eligibility-decision-date/confirmProvidedDecisionDateWasInvalid'),
);

Cypress.Commands.add(
  'provideLocalPlanningDepartment',
  require('../eligibility-local-planning-department/provideLocalPlanningDepartment'),
);

Cypress.Commands.add(
  'provideIneligibleLocalPlanningDepartment',
  require('../eligibility-local-planning-department/provideIneligibleLocalPlanningDepartment'),
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
  'confirmRedirectToExternalService',
  require('../eligibility-local-planning-department/confirmRedirectToExternalService'),
);

Cypress.Commands.add(
  'confirmProvidedLocalPlanningDepartmentWasAccepted',
  require('../eligibility-local-planning-department/confirmProviedLocalPlanningDepartmentWasAccepted'),
);

Cypress.Commands.add(
  'provideNoListedBuildingStatement',
  require('../eligibility-listed-building-status/provideNoListedBuildingStatement'),
);

Cypress.Commands.add(
  'confirmListedBuildingStatementIsRequired',
  require('../eligibility-listed-building-status/confirmListedBuildingStatementIsRequired'),
);

Cypress.Commands.add(
  'stateCaseInvolvesListedBuilding',
  require('../eligibility-listed-building-status/stateCaseInvolvesListedBuilding'),
);

Cypress.Commands.add(
  'confirmListedBuildingsCannotProceed',
  require('../eligibility-listed-building-status/confirmListedBuildingsCannotProceed'),
);

Cypress.Commands.add(
  'stateCaseDoesNotInvolveAListedBuilding',
  require('../eligibility-listed-building-status/stateCaseDoesNotInvolveAListedBuilding'),
);

Cypress.Commands.add(
  'confirmUserCanProceedWithNonListedBuilding',
  require('../eligibility-listed-building-status/confirmUserCanProceedWithNonListedBuilding'),
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

Cypress.Commands.add('accessDetails', require('../eligibility-householder/accessDetails'));

Cypress.Commands.add(
  'confirmDetailsDisplayed',
  require('../eligibility-householder/confirmDetailsDisplayed'),
);
