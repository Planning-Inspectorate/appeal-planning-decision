import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { selectSiteOption } from '../../../../support/full-planning/eligibility/appellant-selects-the-site/select-site-option';
import { getBackLink, getContinueButton, getErrorMessageSummary } from '../../../../support/common-page-objects/common-po';
import { verifyDeselectSiteOption } from '../../../../support/full-planning/eligibility/appellant-selects-the-site/verify-deselect-site-option';
import {
  getNoneOfTheseOption,
  getSelectSiteErrorMessage,
} from '../../../../support/full-planning/eligibility/page-objects/appellant-selects-the-site-po';
import { verifyErrorMessage } from '../../../../support/common/verify-error-message';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
const pageHeading = 'Is your appeal about any of the following?';
const url = 'before-you-start/any-of-following';
const pageTitle = 'Is your appeal about any of the following? - Before you start - Appeal a householder planning decision - GOV.UK';
Given('an appellant is on the is your appeal about any of the following page',()=>{
  goToAppealsPage(url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
});

When('appellant selects {string} from the list of options',(option)=>{
selectSiteOption(option);
});

When('appellant clicks the continue button',()=>{
  getContinueButton().click();
});

Then('appellant gets routed to the have you received an granted or refused page',()=>{
  cy.url().should('contain','/before-you-start/granted-or-refused');
});

When('an appellant selects the back button',()=>{
  getBackLink().click();
});
Then('an appellants gets routed to shutter page which notifies them to use a different service',()=>{
  cy.url().should('contain', '/before-you-start/use-a-different-service');
});

Then('an appellant is taken back to the what type of planning application did you make page',()=>{
  cy.url().should('contain','/before-you-start/type-of-planning-application');
});

Then('{string} gets deselected',(option)=>{
verifyDeselectSiteOption(option);
});

Then('appellant sees an error message {string}',(errorMessage)=>{
  verifyErrorMessage(errorMessage, getSelectSiteErrorMessage ,getErrorMessageSummary);
});

Then('any information they have inputted will not be saved',()=>{
  goToAppealsPage(url);
  getNoneOfTheseOption().should('not.be.checked');
})
