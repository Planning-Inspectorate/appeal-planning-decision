import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';
import '../common/appeal-submission-confirmation';
import '../appellant-confirms-declaration/appellant-confirms-declaration';

Given('an appellant has successfully submitted an appeal', () => {
  cy.goToPageBeforeYouAppeal();
  cy.goToPageStartYourAppeal();
  cy.guidancePageNavigation('start');
  cy.provideCompleteAppeal(STANDARD_APPEAL, {
    chosenLocalPlanningDepartment: 'System Test Borough Council',
  });
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();
});

When('the appellant starts a new appeal', () => {
  cy.goToPageBeforeYouAppeal();
  cy.guidancePageNavigation('next');
  cy.goToPageStartYourAppeal();
  cy.guidancePageNavigation('start');
});

Then('the appellant is able to create a new appeal without any error message', () => {
  cy.userIsNavigatedToPage('/eligibility/householder-planning-permission');
  // check neither of the options is selected
  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  //verify the error "Error: Cannot update appeal that is already submitted" does not exist
  cy.get('#error-summary-title').should('not.exist');
  cy.provideHouseholderAnswerYes();
  cy.clickSaveAndContinue();
  cy.userIsNavigatedToPage('/eligibility/granted-or-refused-permission');
});


Given('an agent has successfully submitted an appeal', () => {
  cy.goToPageBeforeYouAppeal();
  cy.goToPageStartYourAppeal();
  cy.guidancePageNavigation('start');
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
  cy.clickSaveAndContinue();
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();
});

When('the agent starts a new appeal', () => {
  cy.goToPageBeforeYouAppeal();
  cy.guidancePageNavigation('next');
  cy.goToPageStartYourAppeal();
  cy.guidancePageNavigation('start');
});

Then('the agent is able to create a new appeal without any error message', () => {
  cy.userIsNavigatedToPage('/eligibility/householder-planning-permission');
  // check neither of the options is selected
  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  //verify the error"Error: Cannot update appeal that is already submitted" does not exist
  cy.get('#error-summary-title').should('not.exist');
  cy.provideHouseholderAnswerYes();
  cy.clickSaveAndContinue();
  cy.userIsNavigatedToPage('/eligibility/granted-or-refused-permission');
});
