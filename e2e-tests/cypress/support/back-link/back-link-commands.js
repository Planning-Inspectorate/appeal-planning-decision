Cypress.Commands.add(
  'alterDetailsAboutVisitingTheAppealSite',
  require('./alterDetailsAboutVisitingTheAppealSite'),
);

Cypress.Commands.add('clickBackLink', require('./clickBackLink'));

Cypress.Commands.add('clickBackLinkAndValidateUrl', require('./clickBackLinkAndValidateUrl'));

Cypress.Commands.add('hasErrorOnCurrentPage', require('./hasErrorOnCurrentPage'));

Cypress.Commands.add('hasErrorOnPreviousPage', require('./hasErrorOnPreviousPage'));

Cypress.Commands.add(
  'navigateForwardsWithinAppealSteps',
  require('./navigateForwardsWithinAppealSteps'),
);

Cypress.Commands.add(
  'navigateForwardsWithinEligibilitySteps',
  require('./navigateForwardsWithinEligibilitySteps'),
);

Cypress.Commands.add(
  'provideDetailsAboutTheOriginalPlanningApplication',
  require('./provideDetailsAboutTheOriginalPlanningApplication'),
);

Cypress.Commands.add('validateBackLinkIsNotAvailable', require('./validateBackLinkIsNotAvailable'));

Cypress.Commands.add(
  'validateBackStepsFromOriginalPlanningApplicationToTaskList',
  require('./validateBackStepsFromOriginalPlanningApplicationToTaskList'),
);

Cypress.Commands.add(
  'validateBackStepsFromVisitingAppealSiteToCheckYourAnswers',
  require('./validateBackStepsFromVisitingAppealSiteToCheckYourAnswers'),
);

Cypress.Commands.add(
  'validateBackStepsWithinAppealJourney',
  require('./validateBackStepsWithinAppealJourney'),
);

Cypress.Commands.add(
  'validateBackStepsWithinEligibilityJourney',
  require('./validateBackStepsWithinEligibilityJourney'),
);

Cypress.Commands.add('validateBreadcrumbsAreVisible', require('./validateBreadcrumbsAreVisible'));

Cypress.Commands.add(
  'validatePreviousPageDisplayedWithoutCurrentPageRefreshed',
  require('./validatePreviousPageDisplayedWithoutCurrentPageRefreshed'),
);

Cypress.Commands.add(
  'validateThePreviousPageDisplaysWithoutError',
  require('./validateThePreviousPageDisplaysWithoutError'),
);

Cypress.Commands.add(
  'validateUserIsOnServiceStartPage',
  require('./validateUserIsOnServiceStartPage'),
);

Cypress.Commands.add(
  'visitServiceByDirectlyBrowsingToUnexpectedFirstPage',
  require('./visitServiceByDirectlyBrowsingToUnexpectedFirstPage'),
);

Cypress.Commands.add('visitServiceStartPage', require('./visitServiceStartPage'));
