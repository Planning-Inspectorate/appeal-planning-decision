import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

const page = {
  url: 'health-safety',
  id: 'healthSafety',
  heading: 'Are there any health and safety issues on the appeal site?',
  title:
    'Are there any health and safety issues on the appeal site? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  textAreaId: 'health-safety-text',
  noButtonId: 'has-health-safety-no',
  yesButtonId: 'has-health-safety-yes',
};

Before(() => {
  cy.wrap(page).as('page');
});

When(
  `the user selects the link 'Are there any health and safety issues on the appeal site?'`,
  () => {
    cy.goToPage(page.url);
    cy.verifyPageTitle(page.title);
  },
);

Then(
  `the user is presented with the 'Are there any health and safety issues on the appeal site?' page`,
  () => {
    cy.verifyPageHeading(page.heading);
    cy.checkPageA11y(page.url);
  },
);

Then(`the Page title is {string}`, (title) => {
  title = page.title;
  cy.verifyPageTitle(page.title);
});

Given(`user is in the health and safety page`, () => {
  cy.goToPage(page.url);
  cy.verifyPageTitle(page.title);
});

When(`user does not select an option`, () => {
  cy.verifyPageHeading(page.heading);
});

When(`user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

Then(`user is shown an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if there are health and safety issues'
    ? cy.validateErrorMessage(errorMessage, '[data-cy="health-safety-error"]', 'has-health-safety')
    : cy.validateErrorMessage(
        errorMessage,
        '[data-cy="health-safety-text-error"]',
        'health-safety-text',
      );
});

When(`user selects the option {string}`, (option) => {
  option === 'Yes' ? input(page.yesButtonId).check() : input(page.noButtonId).check();
});

Then('a Completed status is populated for the task', () => {
  cy.verifyCompletedStatus(page.id);
});

When(`user enters {string}`, (health_safety) => {
  textArea(page.textAreaId).type(health_safety);
});

Given('user does not provide health and safety issues', () => {
  textArea(page.textAreaId).should('have.value', '');
});

When('user selects the back link', () => {
  cy.clickBackButton();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPageTitle(page.title);
  input(page.noButtonId).should('not.be.checked');
});

Given('a user has completed the information needed on the health and safety page', () => {
  cy.goToPage(page.url);
  input(page.noButtonId).check();
  cy.clickSaveAndContinue();
});

When('the user returns to the health and safety page from the Task List', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPageTitle(page.title);
});

Then('the information they previously entered is still populated', () => {
  input(page.noButtonId).should('be.checked');
});

When('an answer is saved', () => {
  input(page.noButtonId).check();
  cy.clickSaveAndContinue();
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('healthSafety', 'No');
});
