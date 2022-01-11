import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../../../../common/householder-planning/appeals-service/standard-appeal';

import '../../../../common/householder-planning/appeals-service/appeal-submission-confirmation';
import '../../appellant-confirms-declaration/appellant-confirms-declaration';
import { guidancePageNavigation } from '../../../../../support/householder-planning/appeals-service/guidance-pages/guidancePageNavigation';
import { provideCompleteAppeal } from '../../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { userIsNavigatedToPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { provideHouseholderAnswerYes } from '../../../../../support/householder-planning/appeals-service/eligibility-householder/provideHouseholderAnswerYes';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('an appellant has successfully submitted an appeal', () => {
  goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
  guidancePageNavigation('start');
  provideCompleteAppeal(STANDARD_APPEAL, {
    chosenLocalPlanningDepartment: 'System Test Borough Council',
  });
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();
});

When('the appellant starts a new appeal', () => {
  goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
  guidancePageNavigation('next');
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
  guidancePageNavigation('start');
});

Then('the appellant is able to create a new appeal without any error message', () => {
  userIsNavigatedToPage('/eligibility/householder-planning-permission');
  // check neither of the options is selected
  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  //verify the error "Error: Cannot update appeal that is already submitted" does not exist
  cy.get('#error-summary-title').should('not.exist');
  provideHouseholderAnswerYes();
  clickSaveAndContinue();
  userIsNavigatedToPage('/eligibility/granted-or-refused-permission');
});


Given('an agent has successfully submitted an appeal', () => {
  goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
  guidancePageNavigation('start');
  provideCompleteAppeal({
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
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();
});

When('the agent starts a new appeal', () => {
  goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
  guidancePageNavigation('next');
  goToAppealsPage(pageURLAppeal.goToPageStartYourAppeal);
  guidancePageNavigation('start');
});

Then('the agent is able to create a new appeal without any error message', () => {
  userIsNavigatedToPage('/eligibility/householder-planning-permission');
  // check neither of the options is selected
  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  //verify the error"Error: Cannot update appeal that is already submitted" does not exist
  cy.get('#error-summary-title').should('not.exist');
  provideHouseholderAnswerYes();
  clickSaveAndContinue();
  userIsNavigatedToPage('/eligibility/granted-or-refused-permission');
});
