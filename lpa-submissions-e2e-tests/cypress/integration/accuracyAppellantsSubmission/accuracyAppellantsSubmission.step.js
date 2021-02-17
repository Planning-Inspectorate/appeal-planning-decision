import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const pageUrl = '/accuracy-submission';

Given('the user is on the Task List page', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given(`the user is in the Review accuracy of the appellant's submission page`, () => {
  cy.goToReviewAccuracyOfTheAppellantSubmissionPage();
  cy.verifyPage(pageUrl);
});

Given(
  `a user has completed the information needed on the accuracy of the appellant's submission page`,
  () => {
    cy.goToAppealsQuestionnaireTasklistPage();
    cy.verifyPage('/task-list');
    cy.clickOnLinksOnAppealQuestionnaireTaskListPage('submissionAccuracy');
    cy.verifyPage(pageUrl);
    cy.accurateSubmissionRadio('No').check();
    cy.clickSaveAndContinue();
  },
);

When(`the user selects the link "Review accuracy of the appellant's submission"`, () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('submissionAccuracy');
});

When('the user does not select an option', () => {
  cy.accurateSubmissionRadio('Yes').should('not.be.checked');
  cy.accurateSubmissionRadio('No').should('not.be.checked');
});

When(`the user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

When('the user selects {string}', (radioValue) => {
  cy.accurateSubmissionRadio(radioValue).check();
});

When('the user enters {string}', (inaccuracyReason) => {
  cy.inaccuracyReasonInput().type(inaccuracyReason);
});

When('the user has not provided further information as text regarding their reasons', () => {
  cy.inaccuracyReasonInput().should('have.value', '');
});

When('the user returns to the submission accuracy page from the Task List', () => {
  cy.verifyPage('/task-list');
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('submissionAccuracy');
  cy.verifyPage(pageUrl);
});

Then(
  'the user is presented with the page {string}',
  (page) => {
    cy.verifySectionName('About the appeal');
    cy.verifyQuestionTitle(page);
  },
);

Then(
  'the Page Title is {string}',
  (title) => {
    cy.verifyPageTitle(title);
  },
);

Then(
  'the radio group label is {string}',
  (label) => {
    cy.verifyAccurateSubmissionLabel(label);
  },
);

Then('the user is shown the error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage);
});

Then(`the user remains on the Accuracy of the appellant's submission page`, () => {
  cy.verifyPage(pageUrl);
});

Then('the user is taken to the task list', () => {
  cy.verifyPage('/task-list');
});

Then('a Completed status is populated on that page of the task list', () => {
  cy.verifyCompletedStatus('submissionAccuracy');
});

Then('the user is provided with a free text field to input their reasons', () => {
  cy.inaccuracyReasonInput().should('be.visible');
});

Then('the user can see the appeal details panel on the right hand side of the page', () => {
  cy.verifyAppealDetailsSidebar();
});

Then('any information they have inputted will not be saved', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('submissionAccuracy');
  cy.verifyPage(pageUrl);
  cy.accurateSubmissionRadio('No').should('not.be.checked');
});

Then('the information they have previously entered is still populated', () => {
  cy.accurateSubmissionRadio('No').should('be.checked');
});
