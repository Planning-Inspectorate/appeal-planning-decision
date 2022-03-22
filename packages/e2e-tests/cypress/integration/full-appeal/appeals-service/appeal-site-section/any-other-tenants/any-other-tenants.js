import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
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
   errorMessageOtherTenants,
  selectNo,
  selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';


const url = 'full-appeal/submit-appeal/other-tenants';
const areYouATenantUrl = 'full-appeal/submit-appeal/are-you-a-tenant';
const tellingTheTenantsUrl = 'full-appeal/submit-appeal/telling-the-tenants';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const textPageCaption = 'Tell us about the appeal site';
const pageTitle = 'Are there any other tenants? - Appeal a planning decision - GOV.UK';
const pageHeading = 'Are there any other tenants?';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';

Given("an appellant or agent is on the Are you a tenant of the agricultural holding page", () => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', areYouATenantUrl);
})
When("the user select {string} and click 'Continue'", (option) => {
  selectRadioButton(option);
})
Then("'Are there any other tenants' page is displayed", () => {
  cy.url().should('contain', url);
});
Then("the option 'No' is selected", () => {
  selectNo().should('be.checked');
})
Given("an appellant or agent is on the 'Are there any other tenants' page", () => {
  aboutAppealSiteSectionLink().click();
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalHoldingUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', areYouATenantUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', url);
  cy.checkPageA11y();
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText(textPageCaption);
});
Then("the user is taken to the next page 'Telling the other tenants'", () => {
  cy.url().should('contain', tellingTheTenantsUrl);
});
Then("the user is taken to the next page 'Is the site visible from a public road?'", () => {
  cy.url().should('contain', visibleFromRoadUrl);
});
Then('they are presented with an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageOtherTenants, getErrorMessageSummary);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Are you a tenant of the agricultural holding?'", () => {
  cy.url().should('contain', areYouATenantUrl);
});
