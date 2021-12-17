import { Given, When, Then, After } from 'cypress-cucumber-preprocessor/steps';

Given('an appellant or agent is checking their eligibility with JavaScript disabled', () => {
  cy.goToPageStartYourAppeal({ script: false });
});

Given('an appellant or agent is creating an appeal with JavaScript disabled', () => {
  cy.goToSiteAddressPage({ script: false });
});

Given('an appellant or agent is on the task list with JavaScript disabled', () => {
  cy.goToTaskListPage({ script: false });
});

Given('an appellant or agent is on check your answers with JavaScript disabled', () => {
  cy.goToCheckYourAnswersPage({ script: false });
});

Given('an appellant or agent is checking their eligibility with JavaScript enabled', () => {
  cy.goToPageStartYourAppeal({ script: true });
});

Given('an appellant or agent is creating an appeal with JavaScript enabled', () => {
  cy.goToSiteAddressPage();
});

Given('an appellant or agent is on the task list with JavaScript enabled', () => {
  cy.goToTaskListPage();
});

Given('an appellant or agent is on check your answers with JavaScript enabled', () => {
  cy.goToCheckYourAnswersPage();
});

Given('an appellant or agent had an error on the previous page', () => {
  cy.hasErrorOnPreviousPage();
});

Given('an appellant or agent has an error on the current page', () => {
  cy.hasErrorOnCurrentPage();
});

Given('an appellant or Agent didn’t come from a previous page in the service', () => {
  cy.visitServiceByDirectlyBrowsingToUnexpectedFirstPage();
});

Given('an appellant or Agent visits the ‘Start’ page of the service', () => {
  cy.visitServiceStartPage();
});

When('they navigate forwards within the eligibility steps', () => {
  cy.navigateForwardsWithinEligibilitySteps();
});

When('they navigate forwards within the appeal steps', () => {
  cy.navigateForwardsWithinAppealSteps();
});

When('they provide details about the original planning application', () => {
  cy.provideDetailsAboutTheOriginalPlanningApplication();
});

When('they alter details about visiting the appeal site', () => {
  cy.alterDetailsAboutVisitingTheAppealSite();
});

When('the appellant or agent uses the back link', () => {
  cy.clickBackLinkAndValidateUrl({
    expectedUrl: /\/appellant-submission\/application-number$/,
  });
});

When('the appellant or agent selects to go back', () => {
  cy.clickBackLink();
});

When('the appellant or agent wishes to go back', () => {
  cy.validateBackLinkIsNotAvailable();
});

Then('they will be able to navigate back to the previous page within the eligibility steps', () => {
  cy.validateBackStepsWithinEligibilityJourney();
});

Then('they will be able to navigate back to the previous page within the appeal steps', () => {
  cy.validateBackStepsWithinAppealJourney();
});

Then(
  'they will be able to navigate back from the original planning application steps to the task list',
  () => {
    cy.validateBackStepsFromOriginalPlanningApplicationToTaskList();
  },
);

Then(
  'they will be able to navigate back from the visiting the appeal site steps to check your answers',
  () => {
    cy.validateBackStepsFromVisitingAppealSiteToCheckYourAnswers();
  },
);

Then('the page will be displayed without the error', () => {
  cy.validateThePreviousPageDisplaysWithoutError();
});

Then('the previous page will be displayed without the current page being refreshed', () => {
  cy.validatePreviousPageDisplayedWithoutCurrentPageRefreshed();
});

Then('they will be taken to the ‘Start’ page of the service', () => {
  cy.validateUserIsOnServiceStartPage();
});

Then('they must use breadcrumbs or browser back button', () => {
  cy.validateBreadcrumbsAreVisible();
});
