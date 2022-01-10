import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

import { selectListedBuildingDecision } from '../../../../support/eligibility/listed-building/select-listed-building-decision';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  getIsListedBuilding,
  getIsNotListedBuilding,
  getListedBuildingDecisionError,
} from '../../../../support/householder-planning/appeals-service/page-objects/householder-planning-listed-building-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  getBackLink,
  getErrorMessageSummary,
} from '../../../../support/common-page-objects/common-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { getNoneOfTheseOption } from '../../../../support/householder-planning/appeals-service/page-objects/householder-planning-listed-building-po';

const pageTitle =
  'Is your appeal about a listed building? - Before you start - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Is your appeal about a listed building?';
const errorMessage = 'Select yes if your appeal about a listed building';
const url = 'before-you-start/listed-building-householder';
const enforcementNoticePageUrl = '/enforcement-notice-householder';
const useADifferentServicePageUrl = '/use-a-different-service'
const typeOfPlanningApplicationPageUrl = '/type-of-planning-application';

Given('appellant is on the is your application about a Listed Building Page', () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});

When('appellant selects the option as {string}', (decision) => {
  selectListedBuildingDecision(decision);
});

When('appellant clicks on the continue button', () => {
  getContinueButton().click();
});

When('appellant has not made any selection', () => {});

When('appellant selects the back link', () => {
  getBackLink().click();
});

Then('appellant is navigated to the have you received an enforcement notice page', () => {
  cy.url().should('contain', enforcementNoticePageUrl);
});

Then('appellant gets an error message on the same page', () => {
  verifyErrorMessage(errorMessage, getListedBuildingDecisionError, getErrorMessageSummary);
});

Then('appellant is navigated to the what type of planning application did you make page', () => {
  cy.url().should('contain', typeOfPlanningApplicationPageUrl);
});

Then('appellant is navigated to the use a different service page', () => {
  cy.url().should('contain', useADifferentServicePageUrl);
});

And('any information they have inputted will not be saved', () => {
  goToAppealsPage(url);
  getIsListedBuilding().should('not.be.checked');
  getIsNotListedBuilding().should('not.be.checked');
});

// When('the appellant clicks the back button', () => {
//   getBackLink().click();
// });

// Then('the appellant is navigated to Was your planning application about any of the following?', () => {
//   cy.url().should('contain',previousPageUrl);
// });
