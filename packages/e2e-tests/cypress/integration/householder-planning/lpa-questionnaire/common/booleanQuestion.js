import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { input } from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
import { verifyPage } from '../../../../support/common/verifyPage';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import {
  confirmCheckYourAnswersDisplayedTextIsBlank
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayedTextIsBlank';
import { checkSubmissionPdfContent } from '../../../../support/common/pdfFunctions';

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
    goToPage(url);
  });
  fillAnswer();
  clickSaveAndContinue();
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
  clickSaveAndContinue();
});

Then('officer progresses to the task list from yes no question', () => {
  clickSaveAndContinue();
  verifyPage('task-list');
});

Then('progress is halted with an error message to select an answer', () => {
  clickSaveAndContinue();
  cy.get('@page').then(({ emptyError }) => {
    validateErrorMessage(emptyError, `[data-cy="${QUESTION_ID}-error"]`, QUESTION_ID);
  });
});

Then('progress is halted with an error message to enter details', () => {
  clickSaveAndContinue();
  cy.get('@page').then(({ textEmptyError }) => {
    validateErrorMessage(textEmptyError, `[data-cy="${TEXT_ID}-error"]`, TEXT_ID);
  });
});

Then('any data inputted will not be saved', () => {
  cy.get('@page').then(({ url, textChildOf }) => {
    goToPage(url);
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
      confirmCheckYourAnswersDisplayed(id, textChildOf);
      confirmCheckYourAnswersDisplayed(id, textMock);
    } else {
      confirmCheckYourAnswersDisplayed(id, 'Yes');
    }
  });
});

Then('{string} answer should be blank', () => {
  cy.get('@page').then(({ id, textChildOf, textMock }) => {
    confirmCheckYourAnswersDisplayedTextIsBlank(id, '');
  });
});

Then('the updated yes or no answer is displayed', () => {
  cy.get('@page').then(({ id, textChildOf }) => {
    if (textChildOf) {
      confirmCheckYourAnswersDisplayed(id, textChildOf ? 'No' : 'Yes');
    } else {
      confirmCheckYourAnswersDisplayed(id, 'No');
    }
  });
});

Then('data from check your answer page for a yes or no question is displayed on the PDF', () => {
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.get('@page').then(({ heading, textChildOf, textMock }) => {
      downloadSubmissionPdf().then(() => {
        if (textChildOf) {
          checkSubmissionPdfContent(`${heading} ${textChildOf} ${textMock}`);
        } else {
          checkSubmissionPdfContent(`${heading} Yes`);
        }
      });
    });
  }
});
