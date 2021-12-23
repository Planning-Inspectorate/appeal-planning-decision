import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { provideHouseholderPlanningPermissionStatusRefused } from '../../../../support/householder-planning/appeals-service/eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusRefused';
import { confirmNavigationDecisionDatePage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationDecisionDatePage';
import { provideHouseholderPlanningPermissionStatusGranted } from '../../../../support/householder-planning/appeals-service/eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusGranted';
import { confirmNavigationGrantedRefusedKickoutPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationGrantedRefusedKickoutPage';
import { validateBackLinkIsNotAvailable } from '../../../../support/householder-planning/appeals-service/back-link/validateBackLinkIsNotAvailable';
import { provideHouseholderPlanningPermissionStatusNoDecision } from '../../../../support/householder-planning/appeals-service/eligibility-granted-or-refused-permission/provideHouseholderPlanningPermissionStatusNoDecision';
import { confirmNavigationNoDecisionDatePage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationNoDecisionDatePage';
import { confirmNavigationGrantedOrRefusedPermissionPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationGrantedOrRefusedPermissionPage';
import { confirmTextOnPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmTextOnPage';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('Householder Planning Permission Status is requested', () => {
  goToAppealsPage(pageURLAppeal.goToGrantedOrRefusedPermissionPage);
})

When('Householder Planning Permission Status is set to Refused', () => {
    provideHouseholderPlanningPermissionStatusRefused();
    clickSaveAndContinue();
})

Then('progress is made to the eligibility Decision Date question', () => {
    confirmNavigationDecisionDatePage();
})

When('Householder Planning Permission Status is set to Granted', () => {
  provideHouseholderPlanningPermissionStatusGranted();
  clickSaveAndContinue();
})

Then('User is navigated to kick-out page', () => {
  confirmNavigationGrantedRefusedKickoutPage();
  validateBackLinkIsNotAvailable();
})

When('Householder Planning Permission Status is set to I have not received a decision', () => {
  provideHouseholderPlanningPermissionStatusNoDecision();
  clickSaveAndContinue();
})

Then('User is navigated to no-decision page', () => {
  confirmNavigationNoDecisionDatePage();
  validateBackLinkIsNotAvailable();
})

When('No Householder Planning Permission Status is not selected', () => {
    clickSaveAndContinue();
})

Then('Progress is halted with a message that a Householder Planning Permission Status is required', () => {
  cy.title().should('include', 'Error: ');
  confirmNavigationGrantedOrRefusedPermissionPage();
  confirmTextOnPage('Select if your planning permission was granted or refused, or if you have not received a decision');
  // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  // cy.checkPageA11y({
  //   exclude: ['.govuk-radios__input'],
  // });
})
