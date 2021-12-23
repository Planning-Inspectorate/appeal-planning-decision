import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { pageURLAppeal } from './pageURLAppeal';
import { goToAppealsPage } from '../../../support/householder-planning/appeals-service/go-to-page/goToAppealsPage';
import { confirmNavigationCostsPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationCostsPage';
import { confirmTextOnPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmTextOnPage';
import { confirmGuidanceLinkDisplayed } from '../../../support/householder-planning/appeals-service/eligibility-costs/confirmGuidanceLinkDisplayed';
import { confirmAcpLinkDisplayed } from '../../../support/householder-planning/appeals-service/eligibility-costs/confirmAcpLinkDisplayed';
import { confirmNavigationCostsOutPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationCostsOutPage';
import { clickSaveAndContinue } from '../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmNavigationYourAppealStatementPage } from '../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationYourAppealStatementPage';
import { provideCostsAnswerNo } from '../../../support/householder-planning/appeals-service/eligibility-costs/provideCostsAnswerNo';
import { provideCostsAnswerYes } from '../../../support/householder-planning/appeals-service/eligibility-costs/provideCostsAnswerYes';

Given('an answer to the Costs question is requested', () => {
  //cy.goToCostsPage();
  goToAppealsPage(pageURLAppeal.goToCostsPage);
});

Given('an Appeal exists', () => {
  //cy.goToTaskListPage();
  goToAppealsPage(pageURLAppeal.goToTaskListPage);

});

When('not claiming Costs is confirmed', () => {
  provideCostsAnswerNo();
  clickSaveAndContinue();
});

When('claiming Costs is confirmed', () => {
  provideCostsAnswerYes();
  clickSaveAndContinue();
});

When('the Costs question is not answered', () => {
  clickSaveAndContinue();
});

Then('progress is made to Your appeal statement', () => {
  confirmNavigationYourAppealStatementPage();
});

Then('progress is halted with a message that claiming for Costs is not supported', () => {
  confirmNavigationCostsOutPage();
  confirmTextOnPage('This service is not available if you are claiming costs');
});

Then('progress is halted with a message that an answer to the Costs question is required', () => {
  confirmNavigationCostsPage();
  confirmTextOnPage('Select yes if you are claiming for costs as part of your appeal');
  cy.title().should('match', /^Error: /);
  //Accessibility Testing
  //cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input']
  });


Then(
  'access is available to guidance while an answer to the Costs question is still requested',
  () => {
    confirmGuidanceLinkDisplayed();
  },
);

Then('access is available to ACP', () => {
  confirmAcpLinkDisplayed();
});
