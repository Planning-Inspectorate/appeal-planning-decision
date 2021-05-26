import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input } from '../../support/PageObjects/common-page-objects';

const QUESTION_ID = 'booleanInput';
const YES_ID = 'booleanInput-yes';
const NO_ID = 'booleanInput-no';

const completeBoolean = (value, submit = true) => {
  input(value).check();
  if (submit) cy.clickSaveAndContinue();
};

Given('The yes or no question {string} has been completed', () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url);
  });
  completeBoolean(YES_ID);
});

When('an answer to the question is not provided', () => {
  input(YES_ID).should('not.be.checked');
  input(NO_ID).should('not.be.checked');
  cy.clickSaveAndContinue();
});

When('the answer is {string}', (answer) => {
  completeBoolean(answer === 'yes' ? YES_ID : NO_ID);
});

When('an answer is given but not submitted', () => {
  completeBoolean(YES_ID, false);
});

When('a yes or no answer is saved', () => {
  completeBoolean(NO_ID);
});

Then('progress is halted with an error message to select an answer', () => {
  cy.get('@page').then(({ emptyError }) => {
    cy.validateErrorMessage(emptyError, `[data-cy="${QUESTION_ID}-error"]`, QUESTION_ID);
  });
});

Then('any data inputted will not be saved', () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url);
  });
  input(YES_ID).should('not.be.checked');
  input(NO_ID).should('not.be.checked');
});

Then('the yes or no information they previously entered is still populated', () => {
  input(YES_ID).should('be.checked');
});

Then('{string} yes or no question and answer should be displayed', () => {
  cy.get('@page').then(({ id }) => {
    cy.confirmCheckYourAnswersDisplayed(id, 'Yes');
  });
});

Then('the updated yes or no answer is displayed', () => {
  cy.get('@page').then(({ id }) => {
    cy.confirmCheckYourAnswersDisplayed(id, 'No');
  });
});

Then('data from check your answer page for a yes or no question is displayed on the PDF', () => {
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.get('@page').then(({ heading }) => {
      cy.downloadSubmissionPdf().then(() => {
        cy.checkSubmissionPdfContent(`${heading} Yes`);
      });
    });
  }
});
