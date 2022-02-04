import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { acceptCookiesBanner } from '../../../../../support/common/accept-cookies-banner';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
   errorMessageAreYouATenant,  selectNo, selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';


const  url = 'full-appeal/submit-appeal/are-you-a-tenant';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const otherTenantsUrl = 'full-appeal/submit-appeal/other-tenants'
const tellingTheTenantsUrl = 'full-appeal/submit-appeal/telling-the-tenants';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = 'Are you a tenant of the agricultural holding? - Appeal a planning decision - GOV.UK';
const pageHeading = 'Are you a tenant of the agricultural holding?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';

Given("an appellant or agent is on the 'Is the appeal site part of an agricultural holding' page", () => {
  goToAppealsPage(taskListUrl);
  acceptCookiesBanner();
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
})
When("the user select {string} and click 'Continue'", (options) => {
  switch (options) {
    case 'Yes':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'No':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
})
Then("'Are you a tenant of the agricultural holding?' page is displayed", () => {
  cy.url().should('contain', agriculturalHoldingUrl);
});
Given("an appellant or agent is on the 'Are you a tenant of the agricultural holding?' page", () => {
  goToAppealsPage(url);
  acceptCookiesBanner();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText(textPageCaption);
});
Then("the user is taken to the next page 'Are there any other tenants?' page is displayed", () => {
  goToAppealsPage(otherTenantsUrl);
});
Then("are taken to the next page 'Telling the tenants'", () => {
  cy.url().should('contain', tellingTheTenantsUrl);
});
Then('they are presented with an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageAreYouATenant, getErrorMessageSummary);
});
Then("they are presented with the 'Is the appeal site part of an agricultural holding?' page", () => {
 cy.url().should('contain', agriculturalHoldingUrl )
})
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
