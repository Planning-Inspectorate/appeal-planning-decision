import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input } from '../../support/PageObjects/common-page-objects';

const QUESTION_ID = 'booleanInput';
const YES_ID = 'booleanInput-yes';
const NO_ID = 'booleanInput-no';
const TEXT_ID = 'booleanInputText';

const getTextBox = () => {
  return cy.get(`[data-cy="${TEXT_ID}"]`);
};

const completeBoolean = (value) => {
  input(value).check();
};

const completeText = () => {
  cy.get('@page').then(({ textMock }) => {
    getTextBox().type(textMock);
  });
};

const fillAnswer = () => {
  cy.get('@page').then(({ textChildOf }) => {
    if (textChildOf) {
      completeBoolean(textChildOf === 'Yes' ? YES_ID : NO_ID);
      completeText();
    } else {
      completeBoolean(YES_ID);
    }
  });
};

Given('The yes or no question {string} has been completed', () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url);
  });
  fillAnswer();
  cy.clickSaveAndContinue();
});

When('an answer to the question is not provided', () => {
  input(YES_ID).should('not.be.checked');
  input(NO_ID).should('not.be.checked');
});

When('the answer is {string}', (answer) => {
  completeBoolean(answer === 'yes' ? YES_ID : NO_ID);
});

When('the officer enters {string} in the text box that appears', () => {
  completeText();
});

When('an answer is given but not submitted', () => {
  fillAnswer();
});

When('a yes or no answer is saved', () => {
  cy.get('@page').then(({ textChildOf }) => {
    if (textChildOf) {
      completeBoolean(textChildOf === 'Yes' ? NO_ID : YES_ID);
    } else {
      completeBoolean(NO_ID);
    }
  });
  cy.clickSaveAndContinue();
});

Then('officer progresses to the task list from yes no question', () => {
  cy.clickSaveAndContinue();
  cy.verifyPage('task-list');
});

Then('progress is halted with an error message to select an answer', () => {
  cy.clickSaveAndContinue();
  cy.get('@page').then(({ emptyError }) => {
    cy.validateErrorMessage(emptyError, `[data-cy="${QUESTION_ID}-error"]`, QUESTION_ID);
  });
});

Then('progress is halted with an error message to enter details', () => {
  cy.clickSaveAndContinue();
  cy.get('@page').then(({ textEmptyError }) => {
    cy.validateErrorMessage(textEmptyError, `[data-cy="${TEXT_ID}-error"]`, TEXT_ID);
  });
});

Then('any data inputted will not be saved', () => {
  cy.get('@page').then(({ url, textChildOf }) => {
    cy.goToPage(url);
    input(YES_ID).should('not.be.checked');
    input(NO_ID).should('not.be.checked');
    if (textChildOf) getTextBox().should('have.value', '');
  });
});

Then('the yes or no information they previously entered is still populated', () => {
  cy.get('@page').then(({ textChildOf, textMock }) => {
    if (textChildOf) {
      input(textChildOf === 'Yes' ? YES_ID : NO_ID).should('be.checked');
      getTextBox()
        .invoke('val')
        .then((text) => {
          expect(text).to.eq(textMock);
        });
    } else {
      input(YES_ID).should('be.checked');
    }
  });
});

Then('{string} yes or no question and answer should be displayed', () => {
  cy.get('@page').then(({ id, textChildOf, textMock }) => {
    if (textChildOf) {
      cy.confirmCheckYourAnswersDisplayed(id, textChildOf);
      cy.confirmCheckYourAnswersDisplayed(id, textMock);
    } else {
      cy.confirmCheckYourAnswersDisplayed(id, 'Yes');
    }
  });
});

Then('the updated yes or no answer is displayed', () => {
  cy.get('@page').then(({ id, textChildOf }) => {
    if (textChildOf) {
      cy.confirmCheckYourAnswersDisplayed(id, textChildOf ? 'No' : 'Yes');
    } else {
      cy.confirmCheckYourAnswersDisplayed(id, 'No');
    }
  });
});

Then('data from check your answer page for a yes or no question is displayed on the PDF', () => {
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.get('@page').then(({ heading, textChildOf, textMock }) => {
      cy.downloadSubmissionPdf().then(() => {
        if (textChildOf) {
          cy.checkSubmissionPdfContent(`${heading} ${textChildOf} ${textMock}`);
        } else {
          cy.checkSubmissionPdfContent(`${heading} Yes`);
        }
      });
    });
  }
});
