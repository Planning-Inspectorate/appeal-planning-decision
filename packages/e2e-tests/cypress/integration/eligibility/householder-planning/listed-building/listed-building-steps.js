import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { selectListedBuildingDecision } from '../../../../support/eligibility/listed-building/select-listed-building-decision';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { acceptCookiesBanner } from '../../../../support/common/accept-cookies-banner';
import {
  getIsListedBuilding,
  getIsNotListedBuilding,
  getListedBuildingDecisionError,
} from '../../../../support/eligibility/page-objects/listed-building-po';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  getBackLink,
  getErrorMessageSummary,
} from '../../../../support/common-page-objects/common-po';
import { getContinueButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import { selectLocalPlanningDepartment } from '../../../../support/before-you-start/local-planning-department';
import { selectPlanningApplicationType } from '../../../../support/eligibility/planning-application-type/select-planning-application-type';

const pageTitle =
  'Is your appeal about a listed building? - Before you start - Appeal a planning decision - GOV.UK';
const pageHeading = 'Is your appeal about a listed building?';
const errorMessage = 'Select yes if your appeal about a listed building';
const url = 'before-you-start/listed-building-householder';
const grantedorrefusedPageUrl = '/granted-or-refused-householder';
const typeOfPlanningApplicationPageUrl = '/type-of-planning-application';
const useExistingServiceListedBuildingUrl =
  '/before-you-start/use-existing-service-listed-building';

Given('appellant is on the is your application about a Listed Building Page', () => {
  goToAppealsPage('before-you-start/local-planning-department');
  acceptCookiesBanner();
  selectLocalPlanningDepartment('System Test Borough Council');
  getContinueButton().click();
  selectPlanningApplicationType('Householder');
  getContinueButton().click();
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  cy.checkPageA11y();
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

Then('appellant is navigated to granted or refused householder page', () => {
  cy.url().should('contain', grantedorrefusedPageUrl);
});

Then('appellant gets an error message on the same page', () => {
  verifyErrorMessage(errorMessage, getListedBuildingDecisionError, getErrorMessageSummary);
});

Then('appellant is navigated to the what type of planning application did you make page', () => {
  cy.url().should('contain', typeOfPlanningApplicationPageUrl);
});

Then('appellant is navigated to the use an existing service for listed buildings page', () => {
  cy.url().should('contain', useExistingServiceListedBuildingUrl);
});

And('any information they have inputted will not be saved', () => {
  goToAppealsPage(url);
  getIsListedBuilding().should('not.be.checked');
  getIsNotListedBuilding().should('not.be.checked');
});
