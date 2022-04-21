import {Given, Then, When} from 'cypress-cucumber-preprocessor/steps';
import {verifyPageHeading} from '../../../../support/common/verify-page-heading';
import {verifyPageTitle} from '../../../../support/common/verify-page-title';
import {selectSiteOption} from '../../../../support/eligibility/appellant-selects-the-site/select-site-option';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../support/common-page-objects/common-po';
import {
  verifyDeselectSiteOption
} from '../../../../support/eligibility/appellant-selects-the-site/verify-deselect-site-option';
import {
  getNoneOfTheseOption,
  getSelectSiteErrorMessage,
} from '../../../../support/eligibility/page-objects/appellant-selects-the-site-po';
import {verifyErrorMessage} from '../../../../support/common/verify-error-message';
import {goToAppealsPage} from '../../../../support/common/go-to-page/goToAppealsPage';
import {getContinueButton} from '../../../../support/householder-planning/appeals-service/page-objects/common-po';
import {getLocalPlanningDepart} from '../../../../support/eligibility/page-objects/local-planning-department-po';
import {
  selectPlanningApplicationType
} from '../../../../support/eligibility/planning-application-type/select-planning-application-type';
import {selectNo} from '../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {acceptCookiesBanner} from "../../../../support/common/accept-cookies-banner";

const pageHeading = 'Was your planning application about any of the following?';
const url = 'before-you-start/any-of-following';
const pageTitle = 'Was your planning application about any of the following? - Before you start - Appeal a planning decision - GOV.UK';
Given('an appellant is on the is your appeal about any of the following page for {string}', (application_type) => {
  goToAppealsPage('before-you-start/local-planning-department');
  acceptCookiesBanner();
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType(application_type);
  getSaveAndContinueButton().click();
  if (application_type === 'Prior approval' || application_type === 'Removal or variation of conditions') {
    selectNo().click();
    getSaveAndContinueButton().click();
  }

  cy.url().should('contain', url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant selects {string} from the list of options', (option) => {
  selectSiteOption(option);
});

When('appellant clicks the continue button', () => {
  getContinueButton().click();
});

Then('appellant gets routed to the have you received an granted or refused page', () => {
  cy.url().should('contain', '/before-you-start/granted-or-refused');
});

When('an appellant selects the back button', () => {
  getBackLink().click();
});
Then('an appellants gets routed to shutter page which notifies them to use a different service', () => {
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('an appellant is taken back to the {string} for {string}', (page, application_type) => {
  cy.log(application_type);
  if (application_type === 'Prior approval') {
    cy.url().should('contain', 'before-you-start/prior-approval-existing-home');
  } else if (application_type === 'Removal or variation of conditions') {
    cy.url().should('contain', 'before-you-start/conditions-householder-permission');
  } else {
    cy.url().should('contain', '/before-you-start/type-of-planning-application');
  }

});

Then('{string} gets deselected', (option) => {
  verifyDeselectSiteOption(option);
});

Then('appellant sees an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage, getSelectSiteErrorMessage, getErrorMessageSummary);
});

Then('any information they have inputted will not be saved for {string}', (application_type) => {
  if (application_type === 'Prior approval') {
    cy.url().should('contain', 'before-you-start/prior-approval-existing-home');
  } else if (application_type === 'Removal or variation of conditions') {
    cy.url().should('contain', 'before-you-start/conditions-householder-permission');
  } else {
    cy.url().should('contain', '/before-you-start/type-of-planning-application');
  }
  goToAppealsPage('before-you-start/any-of-following');
  getNoneOfTheseOption().should('not.be.checked');
})
