import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';
import '../common/appeal-submission-confirmation';
import '../appellant-confirms-declaration/appellant-confirms-declaration';

Given('an appeal is ready to be submitted with System Test Borough Council LPA', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL, {
    chosenLocalPlanningDepartment: 'System Test Borough Council',
  });
  cy.clickCheckYourAnswers();

  // /appellant-submission/check-answers
  cy.clickSaveAndContinue();
});

