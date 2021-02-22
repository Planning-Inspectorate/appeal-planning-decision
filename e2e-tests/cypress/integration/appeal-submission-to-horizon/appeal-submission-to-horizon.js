import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
const { APPEAL_DOCUMENT } = require('../../../../packages/forms-web-app/src/lib/empty-appeal');

const matchWhatWeCanFrom = (hardCodedExpectations) => {
  return {
    ...hardCodedExpectations,
    _id: expect.any(String),
    uuid: expect.any(String),
    appeal: {
      ...hardCodedExpectations.appeal,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      id: expect.any(String),
      decisionDate: expect.any(String),
      yourAppealSection: {
        ...hardCodedExpectations.appeal.yourAppealSection,
        appealStatement: {
          ...hardCodedExpectations.appeal.yourAppealSection.appealStatement,
          uploadedFile: {
            ...hardCodedExpectations.appeal.yourAppealSection.appealStatement.uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          }
        },
      },
      requiredDocumentsSection: {
        ...hardCodedExpectations.appeal.requiredDocumentsSection,
        originalApplication: {
          ...hardCodedExpectations.appeal.requiredDocumentsSection.originalApplication,
          uploadedFile: {
            ...hardCodedExpectations.appeal.requiredDocumentsSection.originalApplication.uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          }
        },
        decisionLetter: {
          ...hardCodedExpectations.appeal.requiredDocumentsSection.decisionLetter,
          uploadedFile: {
            ...hardCodedExpectations.appeal.requiredDocumentsSection.decisionLetter.uploadedFile,
            id: expect.any(String),
            location: expect.any(String),
          }
        }
      }
    }
  };
}

Given('a prospective appellant has provided valid appeal information', () => {
  cy.provideCompleteAppeal();
  cy.clickCheckYourAnswers();

  // /appellant-submission/check-answers
  cy.clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  cy.confirmNavigationTermsAndConditionsPage();

  cy.task('listenToQueue');

  // /appellant-submission/submission
  cy.agreeToTheDeclaration();
});

Then('a case is created for a case officer', () => {
  // /appellant-submission/confirmation
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((actualMessage) => {
    const hardCodedExpectations = require('./ucd-831-ac1.json');
    const reasonableExpectation = matchWhatWeCanFrom(hardCodedExpectations);

    expect(actualMessage).toEqual(reasonableExpectation);
  });
});
