import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';
import { confirmTextOnPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmTextOnPage';
import { confirmNavigationGrantedOrRefusedPermissionPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationGrantedOrRefusedPermissionPage';
import { confirmNavigationHouseholderQuestionOutPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationHouseholderQuestionOutPage';
import { confirmAcpLinkDisplayed } from '../../../../support/householder-planning/appeals-service/eligibility-costs/confirmAcpLinkDisplayed';
import { confirmDetailsDisplayed } from '../../../../support/householder-planning/appeals-service/eligibility-householder/confirmDetailsDisplayed';
import { accessDetails } from '../../../../support/householder-planning/appeals-service/eligibility-householder/accessDetails';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { provideHouseholderAnswerNo } from '../../../../support/householder-planning/appeals-service/eligibility-householder/provideHouseholderAnswerNo';
import { provideHouseholderAnswerYes } from '../../../../support/householder-planning/appeals-service/eligibility-householder/provideHouseholderAnswerYes';
import { confirmNavigationHouseholderQuestionPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/eligibility/confirmNavigationHouseholderQuestionPage';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { getErrorMessageOnLabel } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
const errorMessage = 'Select Yes if you applied for householder planning permission';
Given('access to the appeals service eligibility is available', () => {
  goToAppealsPage(pageURLAppeal.goToLandingPage);
});

Given('the appeals householder planning permission question is requested', () => {
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
});

When('the appeal service eligibility is accessed', () => {
  goToAppealsPage(pageURLAppeal.goToHouseholderQuestionPage);
});

When('no confirmation is provided for householder planning permission question', () => {
  clickSaveAndContinue();
});

When('confirmation is provided for householder planning permission question', () => {
  provideHouseholderAnswerYes();
  clickSaveAndContinue();
});

When('confirmation is not provided for householder planning permission question', () => {
  provideHouseholderAnswerNo();
  clickSaveAndContinue();
});

When('the \'What is householder planning permission\' additional information is accessed', () => {
  accessDetails('details-householder');
});

Then('the appeals householder planning permission question is presented', () => {
  goToAppealsPage(pageURLAppeal.confirmNavigationHouseholderQuestionPage);
});

Then('progress is halted with a message that a householder planning permission is required', () => {
  cy.title().should('include', 'Error: ')
  confirmNavigationHouseholderQuestionPage();
  verifyErrorMessage(errorMessage,getErrorMessageOnLabel,getErrorMessageSummary)
  // checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});

Then('progress is made to the eligibility granted or refused permission status question', () => {
  confirmNavigationGrantedOrRefusedPermissionPage();
});

Then('the user is navigated to the \'This service is only for householder planning appeals\' page', () => {
  confirmNavigationHouseholderQuestionOutPage();
});

Then('access is available to ACP service', () => {
  confirmAcpLinkDisplayed();
});

Then('the householder planning permission additional information is presented', () => {
  confirmDetailsDisplayed('details-householder', 'What is householder planning permission?');
});
