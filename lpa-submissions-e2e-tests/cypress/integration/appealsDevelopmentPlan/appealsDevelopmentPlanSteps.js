import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given(`a LPA Planning Officer is reviewing their LPA Questionnaire task list`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given(`the Development Plan Document and Neighbourhood Plan question is requested`, () => {
  cy.goToDevelopmentPlanPage();
  cy.validateDevelopmentPlanPageTitle();
});

Given(`there is a Development Plan Document and Neighbourhood Plan`, () => {
  cy.goToDevelopmentPlanPage();
  cy.validateDevelopmentPlanPageTitle();
  cy.developmentPlanRadioButton('yes').check();
});

Given(
  'the LPA Planning Officer has selected no and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    cy.goToDevelopmentPlanPage();
    cy.validateDevelopmentPlanPageTitle();
    cy.developmentPlanRadioButton('no').check();
    cy.clickSaveAndContinue();
  },
);

Given(
  'the LPA Planning Officer has selected yes, entered plan details, and completed the Development Plan Document and Neighbourhood Plan question',
  () => {
    cy.goToDevelopmentPlanPage();
    cy.validateDevelopmentPlanPageTitle();
    cy.developmentPlanRadioButton('yes').check();
    cy.clickSaveAndContinue();
  },
);

When(
  'the LPA Planning Officer chooses to provide information regarding the Development Plan and Neighbourhood Plan',
  () => {
    cy.goToDevelopmentPlanPage();
    cy.validateDevelopmentPlanPageTitle();
  },
);

When(`an answer is not provided`, () => {
  cy.validateDevelopmentPlanPageHeading();
  cy.clickSaveAndContinue();
});

When(`there is not a Development plan document or Neighbourhood plan`, () => {
  cy.developmentPlanRadioButton('no').check();
  cy.clickSaveAndContinue();
});

When(`details are provided about the plan {string}`, (plan_details) => {
  cy.inputDevelopmentPlanDetails().type(plan_details);
});

When(`no details are given about the plan`, () => {
  cy.inputDevelopmentPlanDetails().should('have.value', '');
  cy.clickSaveAndContinue();
});

When('the LPA Planning Officer chooses to go to the previous page', () => {
  cy.clickBackButton();
});

When(
  `the LPA Planning Officer returns to the Development Plan Document and Neighbourhood Plan question from the Task List`,
  () => {
    cy.goToAppealsQuestionnaireTasklistPage();
    cy.clickOnLinksOnAppealQuestionnaireTaskListPage('developmentOrNeighbourhood');
    cy.validateDevelopmentPlanPageTitle();
  },
);

Then(`the LPA Planning Officer is presented with the ability to provide information`, () => {
  cy.validateDevelopmentPlanPageHeading();
  cy.validateDevelopmentPlanPageTitle();
});

Then(`progress is halted with an error message {string}`, (errorMessage) => {
  cy.validateDevelopmentPlanErrorMessage(errorMessage);
});

Then(`the LPA Planning Officer remains on the page`, () => {
  cy.validateDevelopmentPlanPageHeading();
  cy.validateDevelopmentPlanPageTitle();
});

Then(`progress is made to the Tasklist`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Then(`the Development Plan Document subsection is shown as completed`, () => {
  cy.verifyCompletedStatus('developmentOrNeighbourhood');
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('developmentOrNeighbourhood');
  cy.validateDevelopmentPlanPageTitle();
  cy.developmentPlanRadioButton('yes').should('not.be.checked');
  cy.developmentPlanRadioButton('no').should('not.be.checked');
  cy.inputDevelopmentPlanDetails().should('have.value', '');
});

Then('the appeal details panel is displayed on the right hand side of the page', () => {
  cy.verifyAppealDetailsSidebar({
    applicationNumber: 'ABC/123',
    applicationAddress: '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
    apellantName: 'Bob Smith',
  });
});

Then('no is still selected', () => {
  cy.developmentPlanRadioButton('no').should('be.checked');
});

Then('yes is still selected, and plan details are still populated', () => {
  cy.developmentPlanRadioButton('yes').should('be.checked');
  cy.inputDevelopmentPlanDetails().should('have.value', '');
});
