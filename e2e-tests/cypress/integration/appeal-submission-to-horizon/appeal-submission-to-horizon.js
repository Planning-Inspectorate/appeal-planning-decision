import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { matchWhatWeCanFrom, STANDARD_APPEAL } from '../common/standard-appeal';

Given('a prospective appellant has provided appeal information', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: true,
        name: 'Appellant Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: null,
      },
    },
  });
  cy.clickCheckYourAnswers();

  // /appellant-submission/check-answers
  cy.clickSaveAndContinue();
});

Given('an agent has provided appeal information', () => {
  cy.provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: false,
        name: 'Agent Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: 'Appellant Name',
      },
    },
  });
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

Then('a case is created for the appellant', () => {
  // /appellant-submission/confirmation
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((actualMessage) => {
    const hardCodedExpectations = require('./ucd-831-ac1.json');
    const reasonableExpectation = matchWhatWeCanFrom(hardCodedExpectations);

    expect(actualMessage).toEqual(reasonableExpectation);
  });
});

Then('a case is created for the appellant and the agent', () => {
  // /appellant-submission/confirmation
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((actualMessage) => {
    const hardCodedExpectations = require('./as-102-ac1.json');
    const reasonableExpectation = matchWhatWeCanFrom(hardCodedExpectations);

    expect(actualMessage).toEqual(reasonableExpectation);
  });
});
