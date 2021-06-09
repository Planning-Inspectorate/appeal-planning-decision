import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { textArea, input } from '../../support/PageObjects/common-page-objects';

const pageId = 'development-plan';
const pageTitle =
  'Development Plan Document or Neighbourhood Plan - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Development Plan Document or Neighbourhood Plan';
const taskListId = 'developmentOrNeighbourhood';
const textAreaId = 'plan-changes-text';
const noButtonId = 'has-plan-submitted-no';
const yesButtonId = 'has-plan-submitted-yes';

Given(`the Development Plan Document and Neighbourhood Plan question is requested`, () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
});

Given(`there is a Development Plan Document and Neighbourhood Plan`, () => {
  cy.goToPage(pageId);
  cy.verifyPageTitle(pageTitle);
  input(yesButtonId).check();
});

Given(
  'the LPA Planning Officer has selected no and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    cy.goToPage(pageId);
    cy.verifyPageTitle(pageTitle);
    input(noButtonId).check();
    cy.clickSaveAndContinue();
  },
);

Given(
  'the LPA Planning Officer has selected yes, entered plan details, and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    cy.goToPage(pageId);
    cy.verifyPageTitle(pageTitle);
    input(yesButtonId).check();
    textArea(textAreaId).type('some_text');
    cy.clickSaveAndContinue();
  },
);

When(
  'the LPA Planning Officer chooses to provide information regarding the Development Plan and Neighbourhood Plan',
  () => {
    cy.goToPage(pageId);
    cy.verifyPageTitle(pageTitle);
  },
);

When(`an answer is not provided`, () => {
  cy.verifyPageHeading(pageHeading);
  cy.clickSaveAndContinue();
});

When(`there is not a Development plan document or Neighbourhood plan`, () => {
  input(noButtonId).check();
  cy.clickSaveAndContinue();
});

When(`details are provided about the plan {string}`, (plan_details) => {
  textArea(textAreaId).type(plan_details);
  cy.clickSaveAndContinue();
});

When(`no details are given about the plan`, () => {
  textArea(textAreaId).should('have.value', '');
  cy.clickSaveAndContinue();
});

When('the LPA Planning Officer chooses to go to the previous page', () => {
  cy.clickBackButton();
});

When(
  `the LPA Planning Officer returns to the Development Plan Document and Neighbourhood Plan question from the Task List`,
  () => {
    cy.goToTaskListPage();
    cy.clickOnSubTaskLink(taskListId);
    cy.verifyPageTitle(pageTitle);
  },
);

When('an answer is saved', () => {
  input(noButtonId).check();
  cy.clickSaveAndContinue();
});

Then(`the LPA Planning Officer is presented with the ability to provide information`, () => {
  cy.verifyPageHeading(pageHeading);
  cy.verifyPageTitle(pageTitle);
});

Then(`progress is halted with an error message {string}`, (errorMessage) => {
  errorMessage === 'Select yes if there is a relevant Development Plan or Neighbourhood Plan'
    ? cy.validateErrorMessage(
        errorMessage,
        '[data-cy="has-plan-submitted-error"]',
        'has-plan-submitted',
      )
    : cy.validateErrorMessage(
        errorMessage,
        '[data-cy="plan-changes-text-error"]',
        'plan-changes-text',
      );
});

Then(`the Development Plan Document subsection is shown as completed`, () => {
  cy.verifyCompletedStatus(taskListId);
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnSubTaskLink(taskListId);
  cy.verifyPageTitle(pageTitle);
  input(yesButtonId).should('not.be.checked');
  input(noButtonId).should('not.be.checked');
  textArea(textAreaId).should('have.value', '');
});

Then('the appeal details panel on the right hand side of the page can be viewed', () => {
  cy.verifyAppealDetailsSidebar({
    applicationNumber: 'ABC/123',
    applicationAddress: '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
    apellantName: 'Bob Smith',
  });
});

Then('no is still selected', () => {
  input(noButtonId).should('be.checked');
});

Then('yes is still selected, and plan details are still populated', () => {
  input(yesButtonId).should('be.checked');
  textArea(textAreaId).should('have.value', 'some_text');
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('developmentOrNeighbourhood', 'No');
});
